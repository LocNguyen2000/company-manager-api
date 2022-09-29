import {Op} from "sequelize"
import User from "../models/users.mjs";
import Employee from "../models/employees.mjs";
import Customer from "../models/customers.mjs";
import Role from "../models/role.mjs"
import { encryptPassword, comparePassword } from "../utils/security.mjs";

export const register = async (req, res) => {
  const { username, password, customerNumber, employeeNumber, isEmployee } =
    req.body;
  let result;
  try {
    if(!username||!password) {
      return res.status(400).json({ message: "not be empty"})
    }
    result = await User.findAll({
      where: {
        [Op.or] : [
          {username: username},
          {employeeNumber: employeeNumber},
          {customerNumber: customerNumber},
        ]
      },
    });
    if(result.length > 0){
      return res.status(400).json({ message: "this username or userId already exist"})
    } 
    if(isEmployee){
      result = await Employee.findByPk(employeeNumber)
    } else {
      result = await Customer.findByPk(customerNumber)
    }
    if(!result){
      return res.status(400).json({ message: "this customer or employee does not exist"})
    }
    let hashPash = await encryptPassword(password)
    const user = await User.create({username, password: hashPash, isEmployee, employeeNumber, customerNumber})
    return res.status(200).json({message: "Register successfully",data: user})
  } catch (error) {
    console.log(error);
  }
};


export const login = async (req, res) => {
  const {username, password} = req.body;
  let result, userRole;
  try {
    result = await User.findAll({where: {username: username},include: { model: Employee}})
    console.log(result);
    // if(!result) {
    //   return res.status(400).json({ message: "Username or Password is invalid"})
    // }
    // let comparePass = await comparePassword(password, result.password);
    // if(!comparePass) {
    //   return res.status(400).json({ message: "Username or Password is invalid"})
    // }
    // if(!result.isEmployee){
    //   return userRole = ROLE.CUSTOMER
    // } 
    // userRole = result.role
    
    // let dataInfo = {
    //   employeeNumber: result.employeeNumber,
    //   customerNumber: result.customerNumber,
    //   role: userRole,
    // }
  } catch (error) {
    console.log(error);
  }
}