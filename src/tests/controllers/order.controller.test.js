
import createError from 'http-errors';
import { Op, ValidationError } from 'sequelize';
import { addOrder, getOrder, updateOrder, deleteOrder } from '../../controllers/orders.controller.mjs'
import sequelize from '../../config/database.mjs';
import { mockCustomer } from '../mocks/customerData.mjs';
import { mockOrder } from '../mocks/orderData.mjs';
import { ORDER_STATUS, ROLE } from '../../config/variables.mjs';


let mockRequest, mockResponse, mockNext, mockTransaction;

const { Order, OrderDetail, Payment, Customer, Product } = sequelize.models;

describe('Order controller', () => {
  describe('get', () => {
    beforeEach(() => {
      mockRequest = {
        query: {
          p: null,
          customerNumber: null
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();

      Order.findAndCountAll = jest.fn()
      Customer.findAll = jest.fn()
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success: get order as customer', async () => {
      mockRequest.query.p = 1;
      mockRequest.query.customerNumber = mockCustomer.customerNumber;
      mockRequest.customerNumber = mockCustomer.customerNumber;
      mockRequest.role = ROLE.CUSTOMER;

      Order.findAndCountAll.mockResolvedValue([mockOrder]);

      let result = await getOrder(mockRequest, mockResponse, mockNext);

      expect(result.status.mock.calls[0][0]).toEqual(200);
      expect(result.json.mock.calls[0][0]).toEqual({ data: [mockOrder] });
    });
    test('error: get other customer order error', async () => {
      mockRequest.query.p = -1;
      mockRequest.query.customerNumber = mockCustomer.customerNumber + 1;
      mockRequest.customerNumber = mockCustomer.customerNumber;
      mockRequest.role = ROLE.CUSTOMER;

      await getOrder(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(createError(401, 'Customer can only check their own order'));
    })
    test('success: get own customers as staff', async () => {
      mockRequest.query.p = null;
      mockRequest.query.customerNumber = mockCustomer.customerNumber;
      mockRequest.employeeNumber = mockCustomer.salesRepEmployeeNumber;
      mockRequest.role = ROLE.STAFF;

      Customer.findAll.mockResolvedValue([
        { customerNumber: mockCustomer.customerNumber },
        { customerNumber: mockCustomer.customerNumber + 1 }
      ]);
      Order.findAndCountAll.mockResolvedValue([mockOrder]);

      let result = await getOrder(mockRequest, mockResponse, mockNext);

      let expectedQuery = Object.assign(mockRequest.query, {
        customerNumber: { [Op.or]: [mockCustomer.customerNumber] }
      })

      expect(Customer.findAll).toHaveBeenCalled();
      expect(Order.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: expectedQuery })
      )
      expect(result.status.mock.calls[0][0]).toEqual(200);
      expect(result.json.mock.calls[0][0]).toEqual({ data: [mockOrder] });
    });
    test('success: get no related own customer as staff', async () => {
      mockRequest.query.p = null;
      mockRequest.role = ROLE.STAFF;

      Customer.findAll.mockResolvedValue([]);

      let result = await getOrder(mockRequest, mockResponse, mockNext);

      expect(result.status.mock.calls[0][0]).toEqual(204);
      expect(result.json.mock.calls[0][0]).toEqual({ message: `You have no related customer's orders to check` });
    });
    test('error: check others staff customer as staff', async () => {
      mockRequest.query.p = null;
      mockRequest.query.customerNumber = mockCustomer.customerNumber;
      mockRequest.employeeNumber = mockCustomer.salesRepEmployeeNumber;
      mockRequest.role = ROLE.STAFF;

      Customer.findAll.mockResolvedValue([
        { customerNumber: mockCustomer.customerNumber + 1 },
        { customerNumber: mockCustomer.customerNumber + 2 }
      ]);

      await getOrder(mockRequest, mockResponse, mockNext);

      let expectedError = createError(401, 'Staff can only check their own customers orders')
      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
    test('error: Server error fail', async () => {
      mockRequest.role = ROLE.PRESIDENT;

      let error = new Error('Server error fail');
      Order.findAndCountAll.mockRejectedValue(error);

      await getOrder(mockRequest, mockResponse, mockNext);

      expect(mockNext.mock.calls[0][0]).toEqual(error);
    });
  });
  describe('post', () => {
    beforeEach(() => {
      mockRequest = {
        body: null,
        username: null,
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();

      mockTransaction = {
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue(),
      };
      sequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

      Order.findByPk = jest.fn()
      Order.findAll = jest.fn()
      Customer.findByPk = jest.fn()
      Payment.create = jest.fn()
      Order.create = jest.fn()
      OrderDetail.create = jest.fn()
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success: Create employee successfully', async () => {

    });
    // test('error: with status 400', async () => {
    // });
    // test('error: Server error fail', async () => {
    //   // trả về lỗi
    //   let error = new Error('Server error fail');

    //   expect(mockNext.mock.calls[0][0]).toEqual(error);
    // });
  });
  //    describe('put', () => {
  //      beforeEach(() => {
  //        mockRequest = {
  //          body: null,
  //          params: {
  //            id: 1,
  //          },
  //        };
  //        mockResponse = {
  //          status: jest.fn().mockReturnThis(),
  //          json: jest.fn().mockReturnThis(),
  //        };
  //        mockNext = jest.fn();

  //      });
  //      afterEach(() => {
  //        jest.clearAllMocks();
  //      });
  //      test('success: Update successfully as president', async () => {

  //      });
  //      test('success: Update successfully as manager', async () => {
  //      });
  //      test('error: Server error fail', async () => {
  //        let error = new Error('Server error fail');

  //        expect(mockNext.mock.calls[0][0]).toEqual(error);
  //      });
  //      test('error: create fail with status 400', async () => {
  //      });
  //    });
  describe('delete', () => {
    beforeEach(() => {
      mockRequest = {
        username: 'tester',
        query: {
          comments: null,
        },
        params: {
          id: null,
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      mockNext = jest.fn();

      mockTransaction = {
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue(),
      };
      sequelize.transaction = jest.fn().mockResolvedValue(mockTransaction);

      Order.findByPk = jest.fn()
      Order.update = jest.fn()
      Payment.destroy = jest.fn()
      Order.destroy = jest.fn()
      OrderDetail.destroy = jest.fn()

    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('success: Delete successfully', async () => {
      mockOrder.status = ORDER_STATUS.IN_PROCESS;
      mockOrder.comments = "Change order status to cancelled";
      mockOrder.toJSON = jest.fn().mockReturnValue(mockOrder)
      let rowAffected = 1;

      Order.findByPk.mockResolvedValue(mockOrder);
      Order.update.mockResolvedValue()
      Payment.destroy.mockResolvedValue(rowAffected);
      Order.destroy.mockResolvedValue(rowAffected);
      OrderDetail.destroy.mockResolvedValue(rowAffected);

      let result = await deleteOrder(mockRequest, mockResponse, mockNext);

      expect(result.status.mock.calls[0][0]).toEqual(200)
      expect(result.json.mock.calls[0][0]).toEqual({ message: `Delete ${rowAffected} order, ${rowAffected} payment, ${rowAffected} details successfully` })
    });
    test('error: Order not found', async () => {
      mockOrder.status = ORDER_STATUS.IN_PROCESS;
      mockOrder.comments = "Change order status to cancelled";

      Order.findByPk.mockResolvedValue(null);
      let error = createError(400, 'Order not found')

      await deleteOrder(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error)
    });
    test('error: Order not found', async () => {
      mockOrder.status = ORDER_STATUS.DISPUTED;
      mockOrder.comments = "Change order status to disputed";

      Order.findByPk.mockResolvedValue(mockOrder);
      
      await deleteOrder(mockRequest, mockResponse, mockNext);
      
      let error = createError(400, 'Cannot delete in current order status')
      expect(mockNext).toHaveBeenCalledWith(error)
    });
    test('error: Server error fail', async () => {
      let error = new Error('Server error fail')

      Order.findByPk.mockRejectedValue(error);

      await deleteOrder(mockRequest, mockResponse, mockNext)

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockNext.mock.calls[0][0]).toEqual(error);
    });
  });
});


