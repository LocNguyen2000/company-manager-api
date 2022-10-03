import { DataTypes } from 'sequelize';

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
    tableName: 'productlines',
  }
);

