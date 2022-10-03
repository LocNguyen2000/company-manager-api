import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.mjs';
import Customer from './customers.mjs';
import Employee from './employees.mjs';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(20),
      validate: {
        len: [3, 20],
        min: {
          args: 3,
          msg: 'Password must have more than 3 characters'
        }
      },
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      validate: {
        len: [6, 100],
        min: {
          args: 6,
          msg: 'Password must have more than 6 characters'
        }
      },
      allowNull: false,
    },
    isEmployee: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Must have this field isEmployee'
        }
      }
    },
    employeeNumber: {
      type: DataTypes.INTEGER,
    },
    customerNumber: {
      type: DataTypes.INTEGER,
    },
    createdBy: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'admin',
      validate: {
          len: [2, 50],
      },
    },
    updatedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'admin',
        validate: {
            len: [2, 50],
        },
    },
  },
  {
    tableName: 'users',
  }
);
User.belongsTo(Employee, { foreignKey: 'employeeNumber' });
User.belongsTo(Customer, { foreignKey: 'customerNumber' });
export default User;
