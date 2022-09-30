import createError from "http-errors";
import { ValidationError } from "sequelize";
import { sequelize } from "../config/database.mjs";

import { ROLE } from "../config/variables.mjs";
import Office from "../models/offices.mjs"
import Employee from "../models/employees.mjs";



export const getOffice = async (req, res, next) => {
  try {
    const queryFilter = req.query;

    if (req.role == ROLE.LEADER || req.role == ROLE.STAFF || req.role == ROLE.STAFF){
        return next(createError(401, "Not permitted!"))
    }

    let officeList = await Office.findAll({
      where: queryFilter,
    });

    return res.status(200).json({data: officeList});
  } catch (error) {
    next(error);
  }
};

export const addOffice = async (req, res, next) => {
  try {
    const role = req.role, id = req.employeeNumber,
      office = req.body;

    if (role === ROLE.STAFF || role === ROLE.MANAGER || role === ROLE.LEADER) {
      return next(createError(401, "Not permitted!"));
    }

    office = Object.assign(office, {
        createdBy: id,
        updatedBy: id
    })

    const t = await sequelize.transaction()

    let officeInstance = await Office.create(office, {transaction: t});

    await Employee.create({
        lastname: '9999',
        createdBy: id,
        updatedBy: id,
        role: 4,
        jobTitle: 'Staff',
        officeCode: officeInstance.officeCode,
        email: '',
        extension: '',
        firstname: '',
    },{transaction: t})

    await t.commit()

    return res.status(200).json({ data: officeInstance });
  } catch (error) {
    await t.rollback()

    if (error instanceof ValidationError) {
      return next(createError(400, "Wrong data!"));
    } 
    return next(error);
    
  }
};

export const updateOffice = async (req, res) => {
  try {
    const role = req.role,
      office = req.body,
      { id } = req.params;

    if (role === ROLE.STAFF || role === ROLE.LEADER || role === ROLE.MANAGER) {
      return next(createError(401, "Not permitted!"));
    }

    let officeInstance = await Office.update(office, {
      where: {
        officeCode: id
      },
    });

    return res.status(200).json({ data: officeInstance });
  } catch (error) {
    next(error);
  }
};

export const deleteOffice = async (req, res) => {
  try {
    const role = req.role,
      { id } = req.params;

    if (role === ROLE.STAFF || role === ROLE.MANAGER || role === ROLE.LEADER) {
      return next(createError(401, "Not permitted!"));
    }

    let officeInstance = await Office.destroy({where: {officeCode: id}});

    return res.status(200).json({ data: officeInstance.officeCode });

  } catch (error) {
    next(error);
  }
};
