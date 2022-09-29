import {Router} from 'express'

import { addEmployee, deleteEmployee, getEmployee, updateEmployee } from '../controllers/employee.controller.mjs'

const router = Router()

router.get('/',  getEmployee)
router.post('/',  addEmployee)
router.put('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)

export default router;
