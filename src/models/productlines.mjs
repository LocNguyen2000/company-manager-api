import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.mjs';
export const ProductLineFunc = sequelize => sequelize.define(
  'ProductLine',
  {
    productLine: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    textDescription: {
      type: DataTypes.STRING(4000),
    },
    htmlDescription: {
      type: DataTypes.TEXT('medium'),
    },
    image: {
      type: DataTypes.BLOB('medium'),
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
    tableName: 'productlines',
  }
);

// const ProductLine = ProductLineFunc(sequelize)
// export default ProductLine;
