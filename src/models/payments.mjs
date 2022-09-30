import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.mjs";

const Payment = sequelize.define(
  "Payment",
  {
    customerNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        min: 0,
      },
    },
    checkNumber: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      validate: {
        len: [5, 50],
      },
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [2,50]
        }
      },
      updatedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: [2,50]
        }
      },
  },
  {
    tableName: "payments",

  }
);
export default Payment;