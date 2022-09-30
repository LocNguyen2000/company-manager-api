import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.mjs';
import Employee from './employees.mjs';

const Customer = sequelize.define(
  'Customer',
  {
    customerNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        min: 0,
      },
    },
    customerName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [5, 50],
      },
    },
    contactLastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    contactFirstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [8, 20],
      },
    },
    addressLine1: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [10, 50],
      },
    },
    addressLine2: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: [10, 50],
      },
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: [2, 50],
      },
    },
    postalCode: {
      type: DataTypes.STRING(15),
      allowNull: true,
      validate: {
        len: [5, 15],
      },
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    salesRepEmployeeNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
      references: {
        model: Employee,
        key: 'employeeNumber',
      },
    },
    creditLimit: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING(50),
      validate: {
        len: [2, 50],
      },
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      validate: {
        len: [2, 50],
      },
    },
  },
  {
    tableName: 'customers',
  }
);

export default Customer;
