import createError from 'http-errors';
import { ValidationError } from 'sequelize';
import sequelize from '../config/database.mjs';

const {ProductLine} = sequelize.models

export const getProductLine = async (req, res, next) => {
  try {
    const { p: page } = req.query,
      queryFilter = req.query;

    if (page) delete queryFilter.p;

    // Customer trở lên được vào route
    let productLineList = await ProductLine.findAndCountAll({
      where: queryFilter,
      offset: ((page || 1) - 1) * 10,
      limit: 10,
    });

    return res.status(200).json({ data: productLineList });
  } catch (error) {
    next(error);
  }
};

export const addProductLine = async (req, res, next) => {
  try {
    const id = req.employeeNumber,
      productLine = req.body;

    productLine = Object.assign(productLine, {
      createdBy: id,
      updatedBy: id,
    });

    // Customer trở lên được vào route
    let productLineInstance = await ProductLine.create(productLine, { transaction: t });

    return res.status(200).json({ data: productLineInstance });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(createError(400, 'Wrong data!'));
    }
    return next(error);
  }
};

export const updateProductLine = async (req, res) => {
  try {
    const employeeNumber = req.employeeNumber,
      productLine = req.body,
      { id } = req.params;

    productLine = Object.assign(productLine, {
      updatedBy: employeeNumber,
    });

    // Customer trở lên được vào route
    let productLineInstance = await ProductLine.update(productLine, {
      where: {
        productLine: id,
      },
    });

    return res.status(200).json({ data: productLineInstance });
  } catch (error) {
    next(error);
  }
};

export const deleteProductLine = async (req, res) => {
  try {
    const { id } = req.params;

    // Customer trở lên được vào route
    let productLineInstance = await ProductLine.destroy({ where: { productLine: id } });

    return res.status(200).json({ data: productLineInstance.productLine });
  } catch (error) {
    next(error);
  }
};
