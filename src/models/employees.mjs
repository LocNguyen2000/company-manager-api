import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.mjs";

const Employees = sequelize.define('employees', {
    employeeNumber: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
    } ,
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
    email :{
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    officeCode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        
    },
    reportsTo: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    jobTitle: {
        type: DataTypes.STRING(50),
        allowNull: false,
        values: ['President', 'Leader', 'Manager', 'Staff'],
    },
    role: {
        type: DataTypes.INTEGER(11),
    },
})


Employees.hasMany(Employees);


export default Employees;