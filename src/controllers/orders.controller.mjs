import createError from 'http-errors';
import { Op, ValidationError } from 'sequelize';

import sequelize from "../config/database.mjs";
import { ORDER_STATUS, ROLE } from "../config/variables.mjs";

const { Order, Payment, Product, Customer, OrderDetail } = sequelize.models;

export const getOrder = async (req, res, next) => {
    try {
        let queryFilter = req.query;
        let { p: page } = req.query;

        page = page ? ((page <= 0) ? 1 : page) : 1
        delete queryFilter.p

        // role = customer > chỉ check được order của bản thân
        if (req.role == ROLE.CUSTOMER) {
            if (queryFilter.customerNumber && queryFilter.customerNumber != req.customerNumber) {
                return next(createError(401, 'Customer can only check their own order'))
            }

            queryFilter = Object.assign(queryFilter, {
                customerNumber: req.customerNumber
            })
        }
        // role = staff > xem được order của customer của họ
        else if (req.role == ROLE.STAFF) {
            let customersEmployee = await Customer.findAll({ where: { salesRepEmployeeNumber: req.employeeNumber } });
            if (customersEmployee.length == 0) {
                return req.status(204).json({ message: `You have no related customer's orders to check` })
            }

            let customerNumbers = customersEmployee.map(customer => { return customer.customerNumber });

            if (!queryFilter.customerNumber || !customerNumbers.includes(queryFilter.customerNumber)) {
                return next(createError(401, 'Staff can only check their own customers orders'))
            }
        }
        // role = leader, manager, president > xem mọi
        let orders = await Order.findAndCountAll({ where: queryFilter, offset: (page - 1) * 10, limit: 10, include: { model: OrderDetail } });

        return res.status(200).json({ data: orders })
    } catch (error) {
        next(error);
    }
};
export const addOrder = async (req, res, next) => {
    const username = req.username
    let { order, details, payment } = req.body;

    try {
        var t = await sequelize.transaction();

        // Order
        let orderInstance = await Order.create(
            Object.assign(order, {
                orderDate: new Date().toDateString(),
                updatedBy: username,
                createdBy: username,
            }), { transaction: t })
        
        // STATUS FLOW ERROR
        if (orderInstance.status != ORDER_STATUS.IN_PROCESS && orderInstance.status != ORDER_STATUS.COD){
            throw new ValidationError('New order status must be In-Process or COD')
        }

        // Find if customer exist > get credit limit and customer number
        let customerInstance = await Customer.findByPk(orderInstance.customerNumber, { attributes: ['customerNumber', 'creditLimit'], transaction: t});
        if (!customerInstance){
            throw new Error('This customer does not exist')
        }

        payment = Object.assign(payment, {
            customerNumber: customerInstance.customerNumber,
            paymentDate: new Date().toDateString(),
            updatedBy: username,
            createdBy: username,
        })

        // Payment
        let paymentInstance = await Payment.create(payment, {transaction: t});

        // Payment - check if COD > check payment amount customer > credit limit > reject order
        if (orderInstance.status == ORDER_STATUS.COD){
            let queryFilter = { customerNumber: customerInstance.customerNumber, status: { [Op.not]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED] }}
            
            // Find orders status != (CANCELLED & SHIPPED) 
            let orderWithDetails = await Order.findAll({ where: queryFilter, include: [{model: OrderDetail, required: true, attributes: 
                [
                    'quantityOrdered',
                    'priceEach',
                    sequelize.literal('(Quantity * priceEach)'), 'TotalDetailPayment'] 
            }] ,transaction: t})

            // calculate total payment
            let totalPayment = 0;
            for (const order of orderWithDetails) {
                
                totalPayment += order.OrderDetail.reduce((prevValue, currentValue)=> {
                    prevValue = currentValue.TotalDetailPayment + prevValue;
                    return prevValue;
                }, 0)
            }
            // check payment amount customer > credit limit
            if (totalPayment > customerInstance.creditLimit ){
                throw new ValidationError('Customer total payment are higher than creditLimit')
            }
        }

        // Order details
        if (!(details instanceof Array)){
            throw new ValidationError('Order detail list must be an array')
        }
        let productCodes = details.map(prd => {
            return prd.productCode
        })
        let productsInDb = await Product.findAll({where: {productCode: {[Op.in]: productCodes}}, transaction: t})

        if (productCodes.length != productsInDb.length){
            throw new ValidationError('Some products does not exist')
        }

        let detailInstances = []; 
        for (let detail of details) {
            detail = Object.assign(detail, {
                orderNumber: orderInstance.orderNumber,
                updatedBy: username,
                createdBy: username,
            })

            console.log(detail);
            let instance = await OrderDetail.create( detail, {transaction: t});

            detailInstances.push(instance);
        }

        await t.commit();

        return res.status(201).json({
            message: 'Create order successfully',
            order: orderInstance,
            details: detailInstances,
            payment: paymentInstance,
        })
    } catch (error) {
        await t.rollback();

        if (error instanceof ValidationError) {
            return next(createError(400, error.message));
        }
        return next(error);
    }
};
export const updateOrder = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
};
export const deleteOrder = async (req, res, next) => {
    const { id } = req.params;

    try {
        var t = await sequelize.transaction();

        // find order and order details
        let order = await Order.findByPk(id, { include: { model: OrderDetail }, transaction: t });

        if (!order) {
            return res.status(400).json({ message: 'Order not found' })
        }

        // check status RESOLVE - ONHOLD - INPROCESS > được xóa
        if ((order.status != ORDER_STATUS.RESOLVED) && (order.status != ORDER_STATUS.ON_HOLD) && (order.status != ORDER_STATUS.IN_PROCESS)) {
            return next(createError(400, 'Cannot delete in current order status'))
        }

        // // find payment of order
        // ERROR: ko biet tim payment cua order nao
        // let paymentOrder = await Payment.findOne({where: {customerNumber: order.customerNumber}, transaction: t});
        // await paymentOrder.destroy({transaction: t})

        let orderRowAffected = await Order.destroy({ where: { orderNumber: order.orderNumber }, transaction: t })
        let detailRowsAffected = await OrderDetail.destroy({ where: { orderNumber: order.orderNumber }, transaction: t })

        await t.commit();

        return res.status(200).json({ message: `Delete ${orderRowAffected} order and ${detailRowsAffected} details successfully` })
    } catch (error) {
        await t.rollback()
        next(error);
    }
};
