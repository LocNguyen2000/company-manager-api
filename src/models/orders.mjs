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
    },
    requiredDate: {
      type: DataTypes.DATE,
    },
    shipperedDate: {
      type: DataTypes.DATE,
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
    timestamps: false,
  }
);

export default Order;