import {Router} from 'express'

import { addCustomer, deleteCustomer, getCustomer, updateCustomer } from '../controllers/customer.controller.mjs'
import {verifyToken, isAccess} from '../middlewares/authenticate.mjs'
const router = Router()

router.get('/', verifyToken, getCustomer)
router.post('/',verifyToken, addCustomer)
router.put('/:id',verifyToken,  updateCustomer)
router.delete('/:id',verifyToken, deleteCustomer)

export default router;
