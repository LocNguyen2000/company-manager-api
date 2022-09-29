import {Router} from 'express'

import { addEmployee, deleteEmployee, updateEmployee } from '../controllers/employee.controller.mjs'

const router = Router()

// router.get('/',  getEmployeeById)
router.post('/',  addEmployee)
// router.post('/batch', addEmployeeWithCustomerBatch)
router.put('/:code', updateEmployee)
router.delete('/:code', deleteEmployee)

export default router;
