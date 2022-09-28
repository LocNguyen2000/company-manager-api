import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.mjs";

const Order = sequelize.define(
  "Oder",
  {
    orderNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        min: 0,
      },
    },
    orderDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    requiredDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    shipperedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING[15],
      allowNull: false,
      validate: {
        len: [5, 15],
      },
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "orders",
  }
);
