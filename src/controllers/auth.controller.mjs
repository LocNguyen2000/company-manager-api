import { Op } from 'sequelize';
import User from '../models/users.mjs';
import Employee from '../models/employees.mjs';
import Customer from '../models/customers.mjs';
import { ROLE, TIME_TO_LIVE } from '../config/variables.mjs';
import { encryptPassword, comparePassword, jwtGenerate } from '../utils/security.mjs';

export const register = async (req, res, next) => {
  const { username, password, customerNumber, employeeNumber, isEmployee } = req.body;
  let result;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'not be empty' });
    }

    result = await User.findAll({
      where: {
        [Op.or]: [
          { username: username }, 
          { employeeNumber: employeeNumber ? employeeNumber : null }, 
          { customerNumber: customerNumber ? customerNumber : null }
        ],
      },
    });
    if (result.length > 0) {
      return res.status(400).json({ message: 'this username or userId already exist' });
    }

    result = isEmployee ? (await Employee.findByPk(employeeNumber)) : (await Customer.findByPk(customerNumber));

    if (!result) {
      return res.status(400).json({ message: 'this customer or employee does not exist' });
    }
    let hashPash = await encryptPassword(password);
    const user = await User.create({
      username,
      password: hashPash,
      isEmployee,
      employeeNumber,
      customerNumber,
    });
    return res.status(200).json({ message: 'Register successfully', data: user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;
  let result, userRole;
  try {
    result = await User.findOne({
      where: {
        username,
      },
      include: {
        all: true,
        include: {
          all: true,
        },
      },
      raw: true,
      nest: true,
    });

    if (!result) {
      return res.status(400).json({ message: 'Username or Password is invalid' });
    }
    let comparePass = await comparePassword(password, result.password);

    if (!comparePass) {
      return res.status(400).json({ message: 'Username or Password is invalid' });
    }

    userRole = result.isEmployee ? result.Employee.Role.role : ROLE.CUSTOMER;

    let dataInfo = {
      employeeNumber: result.employeeNumber,
      customerNumber: result.customerNumber,
      role: userRole,
      officeCode: result.Employee.officeCode,
    };

    let accessToken = jwtGenerate(dataInfo);

    res
      .cookie('access_token', accessToken, {
        maxAge: TIME_TO_LIVE * 1000,
        httpOnly: true,
      })
      .status(200)
      .json({
        success: true,
        message: 'Login successful',
        token: accessToken,
      });
  } catch (error) {
    next(error);
  }
};
