import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.mjs';


const Product = sequelize.define(
  'Product',
  {
    productCode: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      validate: {
        len: [1, 15],
      },
    },
    productName: {
      type: DataTypes.STRING(70),
      allowNull: false,
      validate: {
        len: [0, 70],
      },
    },
    productLine: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [0, 50],
      },
    },
    productScale: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        len: [0, 10],
      },
    },
    productVendor: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [0, 50],
      },
    },
    productDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quantityInStock: {
      type: DataTypes.INTEGER(6).UNSIGNED,
      allowNull: false,
    },
    buyPrice: {
      type: DataTypes.FLOAT(10, 2).UNSIGNED,
      allowNull: false,
    },
    MSRP: {
      type: DataTypes.FLOAT(10, 2).UNSIGNED,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
  },
  {
    tableName: 'products',
  }
);



export default Product;
