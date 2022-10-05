import { SECRET_KEY } from '../env/env.mjs';
import config from '../../config/config.mjs';

import createError from 'http-errors';
import { ValidationError } from 'sequelize';
import sequelize from '../../config/database.mjs';
import { ROLE } from '../../config/variables.mjs';
import { mockEmployeesQuery, mockEmployee } from '../mocks/employeeData.mjs';
import { getEmployee, addEmployee, updateEmployee, deleteEmployee } from '../../controllers/employee.controller.mjs';

let mockRequest, mockResponse, mockNext;

const {Employee} = sequelize.models

describe('Employee controller', () => {
    describe('get', () => {
        beforeEach(() => {
            mockRequest = {
                role: null,
                employeeNumber: null,
                officeCode: null,
                query: {
                    employeeNumber: null,
                    p: null,
                }
            }
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            mockNext = jest.fn()

            Employee.findAndCountAll = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks()
        })
        test('success: get employee as president role', async () => {
            mockRequest.role = ROLE.PRESIDENT;
            mockRequest.employeeNumber = 2000;
            mockRequest.query.p = 1;
            mockRequest.query.employeeNumber = mockEmployee.employeeNumber;

            mockEmployeesQuery.rows.push(mockEmployee);
            mockEmployeesQuery.count = mockEmployeesQuery.rows.length;

            console.log(mockEmployeesQuery);
            Employee.findAndCountAll.mockResolvedValue(mockEmployeesQuery)

            let result = await getEmployee(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(200);
            expect(result.json.mock.calls[0][0]).toEqual({ data: mockEmployeesQuery });
        })

        test('success: get employee as leader role', async () => {
            mockRequest.query.p = 1;
            mockRequest.role = ROLE.LEADER;
            mockRequest.employeeNumber = 2000;
            mockRequest.query.employeeNumber = mockEmployee.employeeNumber;

            mockEmployeesQuery.rows.push(mockEmployee);
            mockEmployeesQuery.count = mockEmployeesQuery.rows.length;

            Employee.findAndCountAll.mockResolvedValue(mockEmployeesQuery)

            let result = await getEmployee(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(200);
            expect(result.json.mock.calls[0][0]).toEqual({ data: mockEmployeesQuery });
        })
        test('error: emplyee not found', async () => {
            mockRequest.query.p = 1;
            mockRequest.role = ROLE.MANAGER;
            mockRequest.employeeNumber = 2000;
            mockRequest.query.employeeNumber = mockEmployee.employeeNumber;

            mockEmployeesQuery.rows = [];
            mockEmployeesQuery.count = 0;
            Employee.findAndCountAll.mockResolvedValue(mockEmployeesQuery)

            let result = await getEmployee(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(204);
            expect(result.json.mock.calls[0][0]).toEqual({ message: 'Employee not found' });
        })
        test('error: Server error fail', async () => {
            mockRequest.role = ROLE.MANAGER;
            mockRequest.employeeNumber = 2000;

            let error = new Error('Server error fail')

            Employee.findAndCountAll.mockRejectedValue(error);

            await getEmployee(mockRequest, mockResponse, mockNext);
            expect(mockNext.mock.calls[0][0]).toEqual(error);
        })
    })
    describe('post', () => {
        beforeEach(() => {
            mockRequest = {
                body: null,
                username: null
            }
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            mockNext = jest.fn()
            Employee.create = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('success: Create employee successfully', async () => {
            mockRequest.body = mockEmployee,
            mockRequest.username = "president"

            Employee.create.mockResolvedValue(mockEmployee)
            let result = await addEmployee(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(200);
            expect(result.json.mock.calls[0][0]).toEqual({data: mockEmployee, message: 'Create employee successfully'});
        })
        test('error: with status 400', async () => {
            mockRequest.body = mockEmployee,
            mockRequest.username = "president"

            // trả về lỗi
            let error = new ValidationError('Body request validate fail')
            Employee.create.mockRejectedValue(error);

            await addEmployee(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(createError(400, 'Wrong data!'));
        })
        test('error: Server error fail', async () => {
            mockRequest.body = mockEmployee,
            mockRequest.username = "president"
            // trả về lỗi
            let error = new Error('Server error fail')
            Employee.create.mockRejectedValue(error);

            await addEmployee(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(error);
        })
    })
    describe('put', () => {
        beforeEach(() => {
            mockRequest = {
                role: null,
                officeCode: '1',
                username: 'president',
                body: null,
                params: {
                    id: 1,
                }
            }
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            mockNext = jest.fn()

            Employee.update = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('success: Update successfully as president', async () => {
            mockRequest.body = mockEmployee
            mockRequest.role = ROLE.PRESIDENT

            let rowAffected = 1
            Employee.update.mockResolvedValue(rowAffected)

            let result = await updateEmployee(mockRequest, mockResponse, mockNext);
            expect(result.status.mock.calls[0][0]).toEqual(200);
            expect(result.json.mock.calls[0][0]).toEqual({ message: `Update successfully ${rowAffected} record` });
        })
        test('success: Update successfully as manager', async () => {
            mockRequest.body = mockEmployee
            mockRequest.role = ROLE.MANAGER

            let rowAffected = 1
            Employee.update.mockResolvedValue(rowAffected)

            let result = await updateEmployee(mockRequest, mockResponse, mockNext);
            expect(result.status.mock.calls[0][0]).toEqual(200);
            expect(result.json.mock.calls[0][0]).toEqual({ message: `Update successfully ${rowAffected} record` });
        })
        test('error: Server error fail', async () => {
            mockRequest.body = mockEmployee,
            mockRequest.role = ROLE.MANAGER
            mockRequest.params.id = 2
            // trả về lỗi
            let error = new Error('Server error fail')
            Employee.update.mockRejectedValue(error);

            await updateEmployee(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(error);
        })
    })
    describe('delete', () => {
        beforeEach(() => {
            mockRequest = {
                officeCode: null,
                params: {
                    id: null
                }
            }
        })
    })
})