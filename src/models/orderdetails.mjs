import { DataTypes } from 'sequelize';
import { ProductFunc } from './products.mjs';
import { OrderFunc } from './orders.mjs';

export const OrderDetailFunc = (sequelize) =>
  sequelize.define(
    'OrderDetail',
    {
      orderNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        validate: {
          min: 0,
        },
        references: {
          model: OrderFunc(sequelize),
          key: 'orderNumber',
        },
      },
      productCode: {
        type: DataTypes.STRING(15),
        primaryKey: true,
        validate: {
          len: [1, 15],
        },
        references: {
          model: ProductFunc(sequelize),
          key: 'productCode',
        },
      },
      quantityOrdered: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      priceEach: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
      },
      orderLineNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdBy: {
        type: DataTypes.INTEGER(11),
        validate: {
          min: 0,
        },
      },
      updatedBy: {
        type: DataTypes.INTEGER(11),
        validate: {
          min: 0,
        },
      },
    },
    {
      tableName: 'orderdetails',
    }
  );
