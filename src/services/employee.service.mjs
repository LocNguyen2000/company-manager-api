import  sequelize  from '../config/database.mjs';
const {Customer, Employee} = sequelize.models


const employeeService = {
    get: async () => {},
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
    update: async () => {},
    create: async () => {}
}

export default employeeService;