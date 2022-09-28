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
      type: DataTypes.ENUM['President','Manager','Leader', 'Staff', 'Customer'],
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 50],
        
      },
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
    tableName: "role",
  }
);

export default Role;
