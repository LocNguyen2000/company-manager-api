import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.mjs";
import Role from "./role.mjs";
const Employee = sequelize.define(
  "Employee",
  {
    employeeNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      validate: {
        len: [1, 11],
      },
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    extension: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    officeCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
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
      values: ["President", "Leader", "Manager", "Staff"],
    },
    role: {
      type: DataTypes.INTEGER,
      validate: {
        len: [1, 11],
      },
      references: {
        model: Role,
        key: "id",
      },
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
    tableName: "employees",
  }
);

export default Employee;
