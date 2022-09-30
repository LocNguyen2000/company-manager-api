import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.mjs';
import Orderdetail from './orderdetails.mjs';
import Product from './products.mjs';
const Order = sequelize.define(
  'Order',
  {
    orderNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      validate: {
        min: 0,
      },
    },
    orderDate: {
      type: DataTypes.DATE,
    },
    requiredDate: {
      type: DataTypes.DATE,
    },
    shipperedDate: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        len: [5, 15],
      },
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdBy: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    updatedBy: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    tableName: 'orders',
  }
);



export default Order;
