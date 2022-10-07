import sequelize from '../config/database.mjs';
const { Customer } = sequelize.models


const customerService = {
    get: async (queryFilter, page) => { 
        try {
            let data = await Customer.findAndCountAll({
                where: queryFilter,
                offset: (page - 1) * 10,
                limit: 10,
            });

            return data;
        } catch (error) {
            throw error;
        }   

    },
    delete: async (id) => {
        try {
            // delete customere successfully
            let rowAffected = await Customer.destroy({ where: { customerNumber: id } });

            return rowAffected;
        } catch (error) {
            throw error;
        }
    },
    update: async (data, queryFilter) => {
        try {
            let rowAffected = await Customer.update(data, { where: queryFilter });

            return rowAffected;
        } catch (error) {
            throw error;
        }

    },
    create: async (data) => {
        try {
            let dataInstance = await Customer.create(data);
            
            return dataInstance;
        } catch (error) {
            throw error
        }
    }
}

export default customerService;