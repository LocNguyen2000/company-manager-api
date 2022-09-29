import express from "express";
import cors from "cors";

import config from "./config/config.mjs";
import connectToDb from "./config/database.mjs";

import customerRouter from './routes/customer.route.mjs'
import employeeRouter from './routes/employee.route.mjs'
import loggerRouter from './routes/logger.route.mjs'
import officeRouter from './routes/offices.route.mjs'
import userRouter from './routes/auth.router.mjs'

const app = express();
const port = config.port || process.env.PORT;

connectToDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/users', userRouter)
app.use('/customers', customerRouter)
app.use('/employees', employeeRouter)
app.use('/offices', officeRouter)
app.use('/logger', loggerRouter)

app.use((err, req, res, next) => {
  if (!err) next(createHttpError(404,'Not found'));
  else {
    next(err);
  }
});

app.use((err, req, res) => {
  res.status(err.status || 500).json(err.message);
});

app.listen(port, () => {
  console.log(`App connected successfully on port ${port}`);
});
