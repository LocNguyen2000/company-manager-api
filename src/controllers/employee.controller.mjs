import createError from "http-errors";
import { ValidationError } from "sequelize";

import { ROLE } from "../config/variables.mjs";
import Employee from "../models/employees.mjs";



export const getEmployee = async (req, res, next) => {
  const id = req.employeeNumber,
    role = req.role,
    officeCode = req.officeCode,
    {page} = req.query, 
    queryFilter = req.query

  if (page) delete queryFilter.page;

  try {
    if (role === ROLE.STAFF) {
      queryFilter = Object.assign(queryFilter, { employeeNumber: id });
    } else if (role === ROLE.LEADER) {
      queryFilter = Object.assign(queryFilter, { reportsTo: id });
    } else if (role === ROLE.MANAGER) {
      queryFilter = Object.assign(queryFilter, { officeCode });
    }

    let employeeList = await Employee.findAndCountAll({
      where: queryFilter,
      offset: ((page || 1) - 1) * 10,
      limit: 10,
    });

    return res.status(200).json({data: employeeList});
  } catch (error) {
    next(error);
  }
};

export const addEmployee = async (req, res, next) => {
  try {
    const role = req.role,
      { employee } = req.body;

    if (role === ROLE.STAFF || role === ROLE.MANAGER || role === ROLE.LEADER) {
      return next(createError(401, "Not permitted!"));
    }

    let employeeInstance = await Employee.create(employee);

    return res.status(200).json({ employeeNumber: employeeInstance.employeeNumber });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(createError(400, "Wrong data!"));
    } 
    return next(error);
    
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const role = req.role(),
      officeCode = req.officeCode,
      { employee } = req.body,
      { id } = req.params;

    if (role === ROLE.STAFF || role === ROLE.LEADER) {
      return next(createError(401, "Not permitted!"));
    }

    let queryObj = Object.assign({}, { employeeNumber: id });

    if (role === ROLE.MANAGER) {
      queryObj = Object.assign(queryObj, { officeCode });
    }

    let employeeInstance = await Employee.update(employee, {
      where: queryObj,
    });

    return res.status(200).json({ data: employeeInstance });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const role = req.role,
      { id } = req.params;

    if (role === ROLE.STAFF || role === ROLE.MANAGER || role === ROLE.LEADER) {
      return next(createError(401, "Not permitted!"));
    }

    let employeeInstance = await Employee.destroy({where: {employeeNumber: id}});

    return res.status(200).json({ employeeNumber: employeeInstance.employeeNumber });

  } catch (error) {
    next(error);
  }
};
