import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.mjs";

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.STRING[50],
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 50],
      },
    },
  },
  {
    tableName: "role",
  }
);

export default Role;
