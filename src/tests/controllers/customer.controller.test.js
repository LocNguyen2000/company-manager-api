import Customer from '../../models/customers.mjs';
import { getCustomer } from '../../controllers/customer.controller.mjs';
import { mockCustomersQuery, mockCustomer } from '../mocks/customerData.mjs'

let mockRequest, mockResponse, mockNext;

describe('Customer controller', () => {
    describe('get', () => {
        beforeEach(() => {
            jest.restoreAllMocks();

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
        })
        test('success as president', async () => {
            mockRequest.role = 'President'
            mockRequest.employeeNumber = 1002
            mockRequest.query.customerNumber = mockCustomer.customerNumber;
            
            Customer.findAndCountAll = jest.fn().mockResolvedValue(mockCustomersQuery)

            let result = await getCustomer(mockRequest, mockResponse, mockNext);

            expect(result.json.mock.calls[0][0]).toEqual({data : mockCustomersQuery});
            expect(result.status.mock.calls[0][0]).toEqual(200);
        })
        test('success as manager', async () => {
        })

    })
    describe('post', () => {
        
    })
    describe('put', () => {
        
    })
    describe('delete', () => {
        
    })
})