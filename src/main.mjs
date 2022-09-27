import express from 'express'
import cors from 'cors'
import { errors } from 'celebrate';
import mongoose from 'mongoose';

import customerRouter from './routes/customer.route.mjs'
import employeeRouter from './routes/employee.route.mjs'
import loggerRouter from './routes/logger.route.mjs'
import officeRouter from './routes/offices.route.mjs'

const app = express()
const port = 4000 || process.env.PORT

// mongoose.connect('mongodb://localhost:27017/nodejs-unit3')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/customers', customerRouter)
app.use('/employees', employeeRouter)
app.use('/offices', officeRouter)
app.use('/logger', loggerRouter)

app.use(errors())

app.listen(port, () => {
    console.log(`App connected successfully on port ${port}`)
})
