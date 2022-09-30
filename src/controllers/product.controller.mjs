import createError from 'http-errors';

import { ROLE } from '../config/variables.mjs';
import Product from '../models/products.mjs';

export const getProduct = async (req, res, next) => {
  try {
    const queryFilter = req.query;
    const { p: page } = req.query;

    if (page) delete queryFilter.p;

    // Customer trở lên được quyền vs product
    const products = await Product.findAndCountAll({ where: queryFilter, offset: ((page || 1) - 1) * 10, limit: 10 });

    if (products.length == 0) {
      return res.status(204).json({ message: 'Products not found' });
    }

    return res.status(200).json({ data: products });
  } catch (error) {
    next(error);
  }
};
export const addProduct = async (req, res, next) => {
  try {
    const product = req.body;

    // Customer trở lên được quyền vs product
    const productInstance = await Product.create(product);

    return res.status(200).json({ data: productInstance, message: 'Create employee successfully' });
  } catch (error) {
    next(createError(400, error));
  }
};
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = req.body;

    // Customer trở lên được quyền vs product
    const queryFilter = { productCode: id };

    await Product.update(product, { where: queryFilter });

    return res.status(200).json({ message: 'Update product successfully' });
  } catch (error) {
    next(createError(400, error));
  }
};
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Customer trở lên được quyền vs product
    const queryFilter = { productCode: id };

    await Product.destroy({ where: queryFilter });

    return res.status(200).json({ message: 'Delete product successfully' });
  } catch (error) {
    next(createError(400, error));
  }
};
