import Customer from "../models/customers.mjs"

export const getCustomerById = async (req, res) => {
    try {
        const customerQuery = req.query


        const customers = await Customer.findAll({ where: { customerNumber: code } });

        return res.status(200).json(customers);

    } catch (error) {
        return res.status(500).json("Something is wrong with server")
    }
}

export const addCustomer = async (req, res) => {
    try {
      
    } catch (error) {
        return res.status(400).json("Something is wrong with server")
    }
}

export const updateCustomer = async (req, res) => {
    try {
        
       
    } catch (error) {
        return res.status(500).json("Something is wrong with server")
    }
}

export const deleteCustomer = async (req, res) => {
    try {
       
    } catch (error) {
        return res.status(500).json("Something is wrong with server")
    }
}