import {Router} from 'express'

import { addEmployee, deleteEmployee, getEmployee, updateEmployee } from '../controllers/employee.controller.mjs'

const router = Router()

router.get('/',  getEmployee)
router.post('/',  addEmployee)
router.put('/:employeeID', updateEmployee)
router.delete('/:employeeID', deleteEmployee)

export default router;
