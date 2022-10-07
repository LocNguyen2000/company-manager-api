import sequelize from '../config/database.mjs';
const { Customer, Employee } = sequelize.models


const employeeService = {
    get: async (queryFilter, page) => { 
        try {
            let data = await Employee.findAndCountAll({
                where: queryFilter,
                offset: (page - 1) * 10,
                limit: 10,
            });

            return data;
        } catch (error) {
            throw error;
        }   

    },
    delete: async (id, officeCode) => {
        // add transaction
        const t = await sequelize.transaction();
        try {
            // Find all customer from deleted employee
            const defaultEmployee = await Employee.findOne({
                where: { lastName: '9999', officeCode: officeCode },
                transaction: t,
            });

            const currentCustomers = await Customer.findAll({
                where: { salesRepEmployeeNumber: id },
                transaction: t,
            });

            // change current employee's customer > default employee's customer
            for (const customer of currentCustomers) {
                await customer.update({
                    salesRepEmployeeNumber: defaultEmployee.employeeNumber,
                    transaction: t,
                });
            }

            // delete employeee successfully
            let rowAffected = await Employee.destroy({ where: { employeeNumber: id }, transaction: t });

            await t.commit();

            return rowAffected;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    },
    update: async (data, queryFilter) => {
        try {
            let rowAffected = await Employee.update(data, { where: queryFilter });

            return rowAffected;
        } catch (error) {
            throw error;
        }

    },
    create: async (data) => {
        try {
            let dataInstance = await Employee.create(data);
            return dataInstance;
        } catch (error) {
            throw error
        }
    }
}

export default employeeService;