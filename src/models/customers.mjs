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
        min: {args: 1, msg: 'Must be a positive number'},
      },
    },
    customerName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [5, 50],
        notNull: {
          msg: 'Must not be null'
        },
        notEmpty: {
          msg: 'Must have a value'
        }
      },
    },
    contactLastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [3, 50],
        notNull: {
          msg: 'Must not be null'
        },
        notEmpty: {
          msg: 'Must have a value'
        }
      },
    },
    contactFirstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [3, 50],
        notNull: {
          msg: 'Must not be null'
        },
        notEmpty: {
          msg: 'Must have a value'
        }
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [8, 20],
        notNull: {
          msg: 'Must not be null'
        },
        notEmpty: {
          msg: 'Must have a value'
        }
      },
    },
    addressLine1: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [10, 50],
        notNull: {
          msg: 'Must not be null'
        },
        notEmpty: {
          msg: 'Must have a value'
        }
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
        notNull: {
          msg: 'Must not be null'
        },
        notEmpty: {
          msg: 'Must have a value'
        }
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
        notNull: {
          msg: 'Must not be null'
        },
        notEmpty: {
          msg: 'Must have a value'
        }
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
    tableName: 'customers',
  },
);

export default Customer;
