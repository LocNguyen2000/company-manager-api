import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import { readFile } from 'fs/promises';
import logger from './config/logger.mjs';
import config from './config/config.mjs';
import connectToDb from './config/connect.mjs';
import customerRouter from './routes/customer.route.mjs';
import employeeRouter from './routes/employee.route.mjs';
import loggerRouter from './routes/logger.route.mjs';
import officeRouter from './routes/offices.route.mjs';
import userRouter from './routes/auth.router.mjs';
import productRouter from './routes/product.route.mjs';
import sequelize from './config/database.mjs';
import orderRouter from './routes/order.route.mjs';
import config from './config/config.mjs';


const app = express();
const port = config.port || process.env.PORT;

connectToDb(sequelize, config.MONGO_CONNECTION_STRING);

const swaggerDoc = JSON.parse(await readFile(new URL('./docs/swagger.json', import.meta.url)));

const options = {
  swaggerOptions: {
    explorer: true,
  },
};
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc, options));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// application middleware
app.use('/users', userRouter);
app.use('/customers', customerRouter);
app.use('/employees', employeeRouter);
app.use('/offices', officeRouter);
app.use('/logger', loggerRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);

// Not found method
app.use((req, res, next) => {
  next(createError(404, 'Not found'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (!err.status) {
    logger.write('Error', err.messag, req.username || '');
  } else if (err.status === 400) {
    logger.write('Info', err.message, req.username || '');
  } else {
    logger.write('Warning', err.message, req.username || '');
  }

  return res.status(err.status || 500).json({ status: err.status || 500, message: err.message });
});

app.listen(port, () => {
  console.log(`App connected successfully on port ${port}`);
});
