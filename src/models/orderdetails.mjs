import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.mjs";

const Orderdetail = sequelize.define(
  "OrderDetail",
  {
    orderNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        min: 0,
      },
    },
    productCode: {
      type: DataTypes.STRING[15],
      primaryKey: true,
      validate: {
        len: [5, 15],
      },
    },
    quantityOrdered: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    priceEach: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
    },
    orderLineNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
  },
  {
    tableName: "orderdetails",

  }
);
export default Orderdetail;