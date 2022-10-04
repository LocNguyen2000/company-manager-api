import createError from 'http-errors';
import { ValidationError } from 'sequelize';

import { SECRET_KEY } from '../env/env.mjs';
import config from '../../config/config.mjs';
import sequelize from '../../config/database.mjs';
import { TIME_TO_LIVE } from '../../config/variables.mjs';
import { mockUser } from '../mocks/userData.mjs';
import {mockEmployee} from '../mocks/employeeData.mjs'
import { login, register } from '../../controllers/auth.controller.mjs';
import { encryptPassword } from '../../utils/security.mjs';
let mockRequest, mockResponse, mockNext;

const { User, Employee, Customer } = sequelize.models;

describe('Auth controller', () => {
  beforeAll(() => {
    config.secretKey = SECRET_KEY;
  });
  describe('Login', () => {
    beforeEach(() => {
      mockRequest = {
        body: {
          username: null,
          password: null,
        },
      };
      mockResponse = {
        cookie: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();
      User.findOne = jest.fn();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success login', async () => {
      mockRequest.body.username = 'president';
      mockRequest.body.password = '123';
      mockUser.password = await encryptPassword(mockUser.password);
      User.findOne.mockResolvedValue(mockUser);

      let result = await login(mockRequest, mockResponse, mockNext);

      expect(result.cookie.mock.calls[0][0]).toEqual('access_token');
      expect(result.cookie.mock.calls[0][2]).toMatchObject({ maxAge: TIME_TO_LIVE * 1000, httpOnly: true });
      expect(result.status.mock.calls[0][0]).toEqual(200);
      expect(result.json.mock.calls[0][0]).toMatchObject({ success: true, message: 'Login successful' });
      // expect(mockNext).toHaveBeenCalled()
    });
    test('error: not found user', async () => {
      mockRequest.body.username = 'president';
      mockRequest.body.password = '123';

      mockUser.password = await encryptPassword(mockUser.password);

      User.findOne.mockResolvedValue(null);

      let result = await login(mockRequest, mockResponse, mockNext);

      expect(result.status.mock.calls[0][0]).toEqual(400);
      expect(result.json.mock.calls[0][0]).toEqual({ message: 'Username or Password is invalid' });
    });
    test('error: password does not match', async () => {
      mockRequest.body.username = 'president';
      mockRequest.body.password = '1234';

      mockUser.password = await encryptPassword(mockUser.password);

      User.findOne.mockResolvedValue(mockUser);

      let result = await login(mockRequest, mockResponse, mockNext);

      expect(result.status.mock.calls[0][0]).toEqual(400);
      expect(result.json.mock.calls[0][0]).toEqual({ message: 'Username or Password is invalid' });
    });
    test('error: Server error fail', async () => {
      mockRequest.body.username = mockUser.username;

      let error = new Error('Server error fail');
      User.findOne.mockRejectedValue(error);

      await login(mockRequest, mockResponse, mockNext);
      expect(mockNext.mock.calls[0][0]).toEqual(error);
    });
  });
  describe('Register', () => {
    beforeEach(() => {
      mockRequest = {
        body: {
          username: null,
          password: null,
          customerNumber: null,
          employeeNumber: null,
          isEmployee: null,
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();
      User.findAll = jest.fn();
      User.create = jest.fn();
      Employee.findByPk = jest.fn();
      
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success register', async () => {
     mockRequest.body = {
        username: mockUser.username,
        password: mockUser.password,
        customerNumber: mockUser.customerNumber,
        employeeNumber: mockUser.employee,
        isEmployee: mockUser.isEmployee
     }
        User.findAll.mockResolvedValue({})
        Employee.findByPk.mockResolvedValue(mockEmployee)
        User.create.mockResolvedValue(mockUser)

        let result = await register(mockRequest, mockResponse, mockNext);

        expect(result.status.mock.calls[0][0]).toEqual(200);
        expect(result.json.mock.calls[0][0]).toEqual({ message: 'Register successfully', data: mockUser });
    })
    test('error: req.body is empty', async () => {

      let result = await register(mockRequest, mockResponse, mockNext);
      expect(result.status.mock.calls[0][0]).toEqual(400);
      expect(result.json.mock.calls[0][0]).toEqual({ message: 'not be empty' });
    });
  });
});
