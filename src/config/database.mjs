import { Sequelize } from 'sequelize';
import config from './config.mjs';

// Option 3: Passing parameters separately (other dialects)
export const sequelize = new Sequelize(config.databaseName, config.user, config.password, {
  host: config.host,
  dialect: 'mysql'
});

const connectToDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default connectToDb;

