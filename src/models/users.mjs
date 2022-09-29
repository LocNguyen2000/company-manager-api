import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.mjs";
import Customer from "./customers.mjs";
import Employee from "./employees.mjs";

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(20),
        validate: {
            len: [3, 20]
        },
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(100),
        validate: {
            len: [6, 100]
        },
        allowNull: false,
    },
    isEmployee: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    employeeNumber: {
        type: DataTypes.INTEGER,
        references: {
            model: Employee,
            key: 'employeeNumber'
        }
    },
    customerNumber: {
        type: DataTypes.INTEGER,
        references: {
            model: Customer,
            key: 'customerNumber'
        }
    },
},{
    tableName: 'users',
})
User.hasOne(Employee)
User.hasOne(Customer)
export default User;