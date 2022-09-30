import {Router} from 'express'

import { addEmployee, deleteEmployee, getEmployee, updateEmployee } from '../controllers/employee.controller.mjs'
import {verifyToken, isAccess} from '../middlewares/authenticate.mjs'
const router = Router()

router.get('/',verifyToken,  getEmployee)
router.post('/',verifyToken,  addEmployee)
router.put('/:id',verifyToken, updateEmployee)
router.delete('/:id',verifyToken, deleteEmployee)

export default router;
