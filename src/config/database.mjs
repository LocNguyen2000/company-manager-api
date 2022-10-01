import { Sequelize } from 'sequelize';
import config from './config.mjs';
import addRelations from './relations.mjs';

export const sequelize = new Sequelize(config.databaseName, config.user, config.password, {
  host: config.host,
  dialect: 'mysql',
});

const connectToDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // addRelations(sequelize)

    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default connectToDb;
