import createError from "http-errors";
import { ValidationError } from "sequelize";

import Customer from "../models/customers.mjs"
import { ROLE } from "../config/variables.mjs";

export const getCustomer = async (req, res, next) => {
    try {
        const queryFilter = req.query;
        const { p: page } = req.query;

        if (page) delete queryFilter.p;

        let customers = await Customer.findAndCountAll({ where: queryFilter, offset: ((page || 1) - 1) * 10, limit: 10 });

        if (req.role == ROLE.MANAGER || req.role == ROLE.PRESIDENT || req.role == ROLE.LEADER) {
            // Staff trở lên được xem mọi dữ liệu khách hàng
            if (customers.length == 0) {
                return res.status(204).json([]);
            }
            return res.status(200).json({data: customers});
        }
        else if (req.role == ROLE.STAFF) {
            // Staff chỉ được xem khách hàng của họ
            for (const customer of customers) {
                if (customer.salesRepEmployeeNumber != req.employeeNumber) {
                    return next(createError(403, "Not permitted!"));
                }
            }
            return res.status(200).json({data: customers});
        }
        else if (req.role == ROLE.CUSTOMER) {
            // Chỉ được xem thông tin của họ
            if (customers.length == 0) {
                return res.status(204).json([]);
            }
            for (const customer of customers) {
                if (customer.customerNumber == req.customerNumber) {
                    return res.status(200).json({
                        data: [customer]
                    });
                }
            }
            return next(createError(403, "Not permitted!"));
        }

    } catch (error) {
        return next(error);
    }
}

export const addCustomer = async (req, res, next) => {
    try {
        const customerRequest = req.body;

        if (req.role == ROLE.STAFF || req.role == ROLE.STAFF) {
            return next(createError(403, "Not permitted!"));
        }
        // Staff trở lên được tạo mọi dữ liệu khách hàng
        let customer = await Customer.create(customerRequest);

        return res.status(201).json({ data: customer });

    } catch (error) {
        if (error instanceof ValidationError) {
            return next(createError(400, "Wrong data"));
        }
        return next(error);
    }
}

export const updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customerRequest = req.body;

        if (req.role === ROLE.STAFF) {
            return next(createError(401, "Staff cannot update customer data"));
        }
        else if (req.role === ROLE.CUSTOMER) {
            // Customer chỉ được sửa dữ liệu bản thân
            if (req.customerNumber != id) {
                return next(createError(401, "Customer cannot change others data"));
            }

        }
        // Staff trở lên được update mọi dữ liệu khách hàng
        let queryObj = { customerNumber: id }
        let rowAffected = await Customer.update(customerRequest, { where: queryObj });

        return res.status(200).json({ data: `Update successfully ${rowAffected} row` })

    } catch (error) {
        if (error instanceof ValidationError) {
            return next(createError(400, "Wrong data!"));
        }
        return next(error);
    }
}

export const deleteCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (req.role === ROLE.STAFF || req.role === ROLE.CUSTOMER) {
            return next(createError(401, "Not permitted!"));
        }
        // Staff trở lên được xóa mọi dữ liệu khách hàng
        let queryObj = { customerNumber: id }
        let rowAffected = await Customer.destroy({ where: queryObj });

        return res.status(200).json({ data: `Delete successfully ${rowAffected} row` })
    } catch (error) {
        return next(error);
    }
}