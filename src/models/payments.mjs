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
      type: DataTypes.STRING[50],
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
    delete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
  },
  {
    tableName: "payments",
    timestamps: false,
  }
);
export default Payment;