import createError from 'http-errors';
import { ValidationError } from 'sequelize';
import  sequelize  from '../config/database.mjs';

const {Office, Employee} = sequelize.models

export const getOffice = async (req, res, next) => {
  try {
    const queryFilter = req.query;

    let officeList = await Office.findAll({
      where: queryFilter,
    });

    return res.status(200).json({ data: officeList });
  } catch (error) {
    next(error);
  }
};

export const addOffice = async (req, res, next) => {
  try {
    const username = req.username,
      office = req.body;

    office = Object.assign(office, {
      createdBy: username,
      updatedBy: username,
    });

    const t = await sequelize.transaction();

    let officeInstance = await Office.create(office, { transaction: t });

    await Employee.create(
      {
        lastname: '9999',
        createdBy: username,
        updatedBy: username,
        role: 4,
        jobTitle: 'Staff',
        officeCode: officeInstance.officeCode,
        email: '',
        extension: '',
        firstname: '',
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({ data: officeInstance });
  } catch (error) {
    await t.rollback();

    if (error instanceof ValidationError) {
      return next(createError(400, 'Wrong data!'));
    }
    return next(error);
  }
};

export const updateOffice = async (req, res) => {
  try {
    const username = req.username,
      { id } = req.params,
      office = req.body;

    let officeInstance = await Office.update(Object.assign(office, { updatedBy: username }), {
      where: {
        officeCode: id,
      },
    });

    return res.status(200).json({ data: officeInstance });
  } catch (error) {
    next(error);
  }
};

export const deleteOffice = async (req, res) => {
  try {
    const { id } = req.params;

    let officeInstance = await Office.destroy({ where: { officeCode: id } });

    return res.status(200).json({ data: officeInstance.officeCode });
  } catch (error) {
    next(error);
  }
};
