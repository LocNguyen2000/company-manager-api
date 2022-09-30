import createError from "http-errors";
import { ValidationError } from "sequelize";

import { sequelize } from "../config/database.mjs";
import { ROLE } from "../config/variables.mjs";
import Customer from "../models/customers.mjs";
import Employee from "../models/employees.mjs";

export const getEmployee = async (req, res, next) => {
  try {
    const id = req.employeeNumber,
      role = req.role,
      { p: page } = req.query,
      officeCode = req.officeCode,
      queryFilter = req.query;

    if (page) delete queryFilter.p;

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

    return res.status(200).json({ data: employeeList });
  } catch (error) {
    next(error);
  }
};

export const addEmployee = async (req, res, next) => {
  try {
    const role = req.role,
      id = req.employeeNumber,
      employee = req.body;

    if (role === ROLE.STAFF || role === ROLE.MANAGER || role === ROLE.LEADER) {
      return next(createError(401, "Not permitted!"));
    }

    let employeeInstance = await Employee.create(
      Object.assign(employee, {
        updatedBy: id,
        createdBy: id,
      })
    );

    return res.status(200).json({ data: employeeInstance, message: 'Create employee successfully' });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(createError(400, "Wrong data!"));
    }
    return next(error);
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const role = req.role,
      officeCode = req.officeCode,
      employeeNumber = req.employeeNumber,
      employee = req.body,
      { id } = req.params;

    if (role === ROLE.STAFF || role === ROLE.LEADER) {
      return next(createError(401, "Not permitted!"));
    }

    let queryObj = Object.assign({}, { employeeNumber: id });

    if (role === ROLE.MANAGER) {
      queryObj = Object.assign(queryObj, { officeCode });
    }

    let rowAffected = await Employee.update(
      Object.assign(employee, {
        updatedBy: employeeNumber,
      }),
      {
        where: queryObj,
      }
    );

    return res.status(200).json({ message: `Update successfully ${rowAffected} record` });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res) => {
  const role = req.role;
  const officeCode = req.officeCode;
  const { id } = req.params;

  if (role === ROLE.STAFF || role === ROLE.MANAGER || role === ROLE.LEADER) {
    return next(createError(401, "Not permitted!"));
  }

  // add transaction
  const t = await sequelize.transaction();

  try {
    // Find all customer from deleted employee
    const defaultEmployee = await Employee.findOne({
      where: { lastName: "9999", officeCode: officeCode },
      transaction: t,
    });
    const currentCustomers = await Customer.findAll({
      where: { salesRepEmployeeNumber: id },
      transaction: t
    });

    // change current employee's customer > default employee's customer
    for (const customer of currentCustomers) {
      await customer.update({
        salesRepEmployeeNumber: defaultEmployee.employeeNumber,
        transaction: t
      });
    }

    // delete employeee successfully
    let rowAffected = await Employee.destroy({ where: { employeeNumber: id }, transaction: t });

    await t.commit();

    return res
      .status(200)
      .json({ message: `Delete successfully ${rowAffected} record` });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
