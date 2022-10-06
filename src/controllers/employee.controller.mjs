import createError from 'http-errors';
import { ValidationError } from 'sequelize';
import  sequelize  from '../config/database.mjs';
import { ROLE } from '../config/variables.mjs';
import employeeService from '../services/employee.service.mjs';

const {Employee} = sequelize.models

export const getEmployee = async (req, res, next) => {
  try {
    const id = req.employeeNumber,
      role = req.role,
      officeCode = req.officeCode;
      
    let queryFilter = req.query;
    let{ p: page } = req.query;

    page = page ? ((page <= 0) ? 1 : page) : 1
    delete queryFilter.p

    if (role === ROLE.LEADER) {
      queryFilter = Object.assign(queryFilter, { reportsTo: id });
    } else if (role === ROLE.MANAGER) {
      queryFilter = Object.assign(queryFilter, { officeCode });
    }

    let employeeList = await Employee.findAndCountAll({
      where: queryFilter,
      offset: (page - 1) * 10,
      limit: 10,
    });

    if (employeeList.rows.length == 0) {
      return res.status(204).json({ message: 'Employee not found' });
    }

    return res.status(200).json({ data: employeeList });
  } catch (error) {
    next(error);
  }
};

export const addEmployee = async (req, res, next) => {
  try {
    const employee = req.body,
      username = req.username;

    let employeeInstance = await Employee.create(
      Object.assign(employee, {
        updatedBy: username,
        createdBy: username,
      })
    );

    return res.status(201).json({ data: employeeInstance, message: 'Create employee successfully' });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(createError(400, error.message));
    }
    return next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const role = req.role,
      officeCode = req.officeCode,
      username = req.username,
      employee = req.body,
      { id } = req.params;

    let queryObj = Object.assign({}, { employeeNumber: id });

    if (role === ROLE.MANAGER) {
      queryObj = Object.assign(queryObj, { officeCode });
    }

    let rowAffected = await Employee.update(
      Object.assign(employee, {
        updatedBy: username,
      }),
      {
        where: queryObj,
      }
    );

    return res.status(200).json({ message: `Update successfully ${rowAffected} record` });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(createError(400, error.message));
    }
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  const officeCode = req.officeCode;
  const { id } = req.params;

  try {
    let result = await employeeService.delete(id, officeCode);

    return res.status(200).json({ message: `Delete successfully ${result} record` });
  } catch (error) {
    next(error);
  }
};
