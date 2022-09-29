import { query } from "express";
import createError from "http-errors";
import Employee from "../models/employees.mjs";
import { ValidationError } from "sequelize";

export const getEmployee = async (req, res, next) => {
  const id = req.employeeNumber,
    role = req.role,
    { p: page } = req.query,
    officeCode = req.officeCode,
    queryFilter = req.query;

  delete queryFilter.p;
  try {
    if (role.toLowerCase === "staff") {
      queryFilter = Object.assign(queryFilter, { employeeNumber: id });
    } else if (role.toLowerCase === "leader") {
      queryFilter = Object.assign(queryFilter, { reportsTo: id });
    } else if (role.toLowerCase === "manager") {
      queryFilter = Object.assign(queryFilter, { officeCode });
    }

    let employeeList = await Employee.findAndCountAll({
      where: queryFilter,
      offset: (page || 1 - 1) * 10,
      limit: 10,
    });

    return res.status(200).json({
      employeeList,
    });
  } catch (error) {
    next(error);
  }
};

export const addEmployee = async (req, res, next) => {
  try {
    const role = req.role.toLowerCase(),
      { employee } = req.body;

    if (role === "staff" || role === "manager" || role === "leader") {
      return next(createError(401, "Not permitted!"));
    }

    let employeeInstance = await Employee.create(employee);
    return res
      .status(200)
      .json({ employeeNumber: employeeInstance.employeeNumber });
  } catch (error) {
    if (error instanceof ValidationError) {
      next(createError(400, "Wrong data!"));
    } else {
      next(error);
    }
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const role = req.role.toLowerCase(),
      officeCode = req.officeCode,
      { employee, employeeID } = req.body;

    if (role === "staff" || role === "leader") {
      return next(createError(401, "Not permitted!"));
    }

    let queryObj = Object.assign({}, { employeeNumber: employeeID });

    if (role === "manager") {
      queryObj = Object.assign(queryObj, { officeCode });
    }

    let employeeInstance = await Employee.update(employee, {
      where: queryObj,
    });

    return res
      .status(200)
      .json({ employeeNumber: employeeInstance.employeeNumber });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res) => {
  try {
  } catch (error) {
    next(error);
  }
};
