import {Router} from 'express'

import { addCustomer, deleteCustomer, getCustomerById, updateCustomer } from '../controllers/customer.controller.mjs'

const router = Router()

router.get('/:code', getCustomerById)
router.post('/', addCustomer)
router.put('/:code',  updateCustomer)
router.delete('/:code', deleteCustomer)

export default router;
