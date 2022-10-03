import createError from 'http-errors';
import { ValidationError } from 'sequelize';
import ProductLine from '../models/productlines.mjs';

export const getProductLine = async (req, res, next) => {
  try {
    let { p: page } = req.query;
    const queryFilter = req.query;

    page = page ? ((page <= 0) ? 1 : page) : 1
    delete queryFilter.p

    // Customer trở lên được vào route
    let productLineList = await ProductLine.findAndCountAll({
      where: queryFilter,
      offset: (page - 1) * 10,
      limit: 10,
    });

    return res.status(200).json({ data: productLineList });
  } catch (error) {
    next(error);
  }
};

export const addProductLine = async (req, res, next) => {
  try {
    const username = req.username,
      productLine = req.body;

    // Customer trở lên được vào route
    let productLineInstance = await ProductLine.create(
      Object.assign(productLine, {
        createdBy: username,
        updatedBy: username,
      })
    );

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
    const username = req.username,
      productLine = req.body,
      { id } = req.params;

    // Customer trở lên được vào route
    let productLineInstance = await ProductLine.update(
      Object.assign(productLine, {
        updatedBy: username,
      }),
      {
        where: {
          productLine: id,
        },
      }
    );

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
