import createError from 'http-errors';
import { ValidationError } from 'sequelize';

import Customer from '../../models/customers.mjs';
import { ROLE } from '../../config/variables.mjs'
import { mockCustomersQuery, mockCustomer } from '../mocks/customerData.mjs'
import { getCustomer, addCustomer, updateCustomer, deleteCustomer } from '../../controllers/customer.controller.mjs';

let mockRequest, mockResponse, mockNext;

describe('Customer controller', () => {
    describe('get', () => {
        beforeEach(() => {
            mockRequest = {
                role: null,
                employeeNumber: null,
                customerNumber: null,
                query: {
                    customerNumber: null,
                    p: 1
                }
            }
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            mockNext = jest.fn()

            Customer.findAndCountAll = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks()
        })
        test('success as president', async () => {
            mockRequest.role = ROLE.PRESIDENT;
            mockRequest.employeeNumber = 1
            mockRequest.query.customerNumber = mockCustomer.customerNumber;
            
            // fake data query
            mockCustomersQuery.rows.push(mockCustomer);
            mockCustomersQuery.count = mockCustomersQuery.rows.length;

            Customer.findAndCountAll.mockResolvedValue(mockCustomersQuery)

            let result = await getCustomer(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(200);
            expect(result.json.mock.calls[0][0]).toEqual({ data: mockCustomersQuery });
        })
        test('found no customer as staff', async () => {
            mockRequest.role = ROLE.STAFF;
            mockRequest.employeeNumber = 1;
            mockRequest.query.customerNumber = mockCustomer.customerNumber;

            // fake data query
            mockCustomersQuery.rows = [];
            mockCustomersQuery.count = 0;

            Customer.findAndCountAll.mockResolvedValue(mockCustomersQuery)
            
            let result = await getCustomer(mockRequest, mockResponse, mockNext);
            
            expect(result.status.mock.calls[0][0]).toEqual(204)
            expect(result.json.mock.calls[0][0]).toEqual({ message: 'Customer not found' })
        })
        test('catch error as customer', async () => {
            mockRequest.role = ROLE.CUSTOMER;
            mockRequest.customerNumber = 1;

            let error = new Error('customer not exist')

            Customer.findAndCountAll.mockRejectedValue(error);

            await getCustomer(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(error);
        })

    })
    describe('post', () => {
        beforeEach(() => {
            mockRequest = {
                body: null,
                username: 'tester'
            }
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            }
            mockNext = jest.fn()

            Customer.create = jest.fn()
        })
        afterEach(() => {
            jest.clearAllMocks();
        })
        test('create success with status 201', async () => {
            mockRequest.body = mockCustomer;

            // fake dữ liệu trả về
            Customer.create.mockResolvedValue(mockCustomer);

            let result = await addCustomer(mockRequest, mockResponse, mockNext);

            expect(result.status.mock.calls[0][0]).toEqual(201);
            expect(result.json.mock.calls[0][0]).toEqual({data: mockCustomer});
        })

        test('create error with status 400', async () => {
            mockRequest.body = mockCustomer;

            // trả về lỗi
            let error = new ValidationError('Body request validate fail')
            Customer.create.mockRejectedValue(error);

            await addCustomer(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(createError(400, 'Wrong data'));
        })
        test('create error with status 500', async () => {
            mockRequest.body = mockCustomer;

            // trả về lỗi
            let error = new Error('Server error fail')
            Customer.create.mockRejectedValue(error);

            await addCustomer(mockRequest, mockResponse, mockNext);

            expect(mockNext.mock.calls[0][0]).toEqual(error);
        })
    })
    describe('put', () => {

    })
    describe('delete', () => {

    })
})