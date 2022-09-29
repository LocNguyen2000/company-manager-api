import Customer from "../models/customers.mjs"
import { ROLE } from "../config/variables.mjs";

export const getCustomerByQuery = async (req, res) => {
    try {
        const customerQuery = req.query;
        
        let customers = await Customer.findAll({ where: customerQuery });

        if (req.role == ROLE.MANAGER || req.role == ROLE.PRESIDENT || req.role == ROLE.LEADER){
            // Staff trở lên được xem mọi dữ liệu khách hàng
            if (customers.length == 0) {
                return res.status(204).json([]);
            }
            return res.status(200).json(customers);
        }
        else if (req.role == ROLE.STAFF){
            // Staff chỉ được xem khách hàng của họ
            for (const customer of customers) {
                if (customer.salesRepEmployeeNumber != req.employeeNumber){
                    return res.status(403).json('You are not authorized');
                }
            }

            return res.status(200).json(customers);
        }
        else if (req.role == ROLE.CUSTOMER){
            // Chỉ được xem thông tin của họ
            if (customers.length == 0) {
                return res.status(204).json([]);
            }
            for (const customer of customers) {
                if (customer.customerNumber == req.customerNumber){
                    return res.status(200).json([customer]);
                }
            }
            return res.status(403).json('You are not authorized');
        }

    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Something is wrong with server")
    }
}

export const addCustomer = async (req, res) => {
    try {
        const customerReq = req.body;
        

        if (req.role == ROLE.MANAGER || req.role == ROLE.PRESIDENT || req.role == ROLE.LEADER){
            // Staff trở lên được tạo mọi dữ liệu khách hàng
            
        }
        else {
            return res.status(403).json('You are not authorized');
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json("Bad request error")
    }
}

export const updateCustomer = async (req, res) => {
    try {
        
       
    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Something is wrong with server")
    }
}

export const deleteCustomer = async (req, res) => {
    try {
       
    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Something is wrong with server")
    }
}