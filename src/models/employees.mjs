import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.mjs';
import Role from './role.mjs';
const Employee = sequelize.define(
  'Employee',
  {
    employeeNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      validate: {
        len: [1, 11],
        min: { args: 1, msg: 'Must be a positive number' },
      },
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Must not be null',
        },
        notEmpty: {
          msg: 'Must have a value',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Must not be null',
        },
        notEmpty: {
          msg: 'Must have a value',
        },
      },
    },
    extension: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Must not be null',
        },
        notEmpty: {
          msg: 'Must have a value',
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Must not be null',
        },
        notEmpty: {
          msg: 'Must have a value',
        },
        isEmail: {
          msg: 'Must be an email',
        },
      },
    },
    officeCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Must not be null',
        },
        notEmpty: {
          msg: 'Must have a value',
        },
      },
    },
    reportsTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: [1, 11],
      },
    },
    jobTitle: {
      type: DataTypes.STRING(50),
      allowNull: false,
      values: ['President', 'Leader', 'Manager', 'Staff'],
      validate: {
        isIn: {
          args: [['President', 'Leader', 'Manager', 'Staff']],
          msg: 'Must have one of these role',
        },
      },
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1, 11],
        isInt: {
          msg: 'Must be an integer',
        },
      },
      references: {
        model: Role,
        key: 'id',
      },
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
    tableName: 'employees',
  }
);

Employee.belongsTo(Role, { foreignKey: 'role' });
export default Employee;
