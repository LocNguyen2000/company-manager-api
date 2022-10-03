import { Sequelize, DataTypes } from 'sequelize';
import config from './config.mjs';
import addRelations from './relations.mjs';
import { ProductFunc } from '../models/products.mjs';
import { OrderFunc } from '../models/orders.mjs';
import { OrderDetailFunc } from '../models/orderdetails.mjs';
import { UserFunc } from '../models/users.mjs';
import { EmployeeFunc } from '../models/employees.mjs';
import { CustomerFunc } from '../models/customers.mjs';
import { RoleFunc } from '../models/role.mjs';
import { ProductLineFunc } from '../models/productlines.mjs';
import { OfficeFunc } from '../models/offices.mjs';
import { PaymentFunc } from '../models/payments.mjs';

export const sequelize = new Sequelize(config.databaseName, config.user, config.password, {
  host: config.host,
  dialect: 'mysql',
});

const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    ProductFunc(sequelize)
    ProductLineFunc(sequelize)
    CustomerFunc(sequelize)
    EmployeeFunc(sequelize)
    RoleFunc(sequelize)
    OrderDetailFunc(sequelize)
    OrderFunc(sequelize)
    UserFunc(sequelize)
    OfficeFunc(sequelize)
    PaymentFunc(sequelize)


    addRelations(sequelize, DataTypes)

    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default connectToDb;
