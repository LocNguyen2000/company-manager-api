import {Router} from 'express'

import { addEmployee, deleteEmployee, getEmployeeById, updateEmployee, addEmployeeWithCustomerBatch } from '../controllers/employee.controller.mjs'

const router = Router()

router.get('/:code',  getEmployeeById)
router.post('/',  addEmployee)
router.post('/batch', addEmployeeWithCustomerBatch)
router.put('/:code', updateEmployee)
router.delete('/:code', deleteEmployee)

export default router;
