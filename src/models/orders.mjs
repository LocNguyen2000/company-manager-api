import { DataTypes } from 'sequelize';


export const OrderFunc = sequelize => sequelize.define(
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
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdBy: {
      type: DataTypes.STRING(20),
      validate: {
        len: [3, 20],
        min: {
          args: 3,
          msg: 'Username must have more than 3 characters'
        }
      },
    },
    updatedBy: {
      type: DataTypes.STRING(20),
      validate: {
        len: [3, 20],
        min: {
          args: 3,
          msg: 'Username must have more than 3 characters'
        }
      },
    },
  },
  {
    tableName: 'orders',
  }
);

