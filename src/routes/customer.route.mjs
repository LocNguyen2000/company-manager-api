import {Router} from 'express'

import { addCustomer, deleteCustomer, getCustomerByQuery, updateCustomer } from '../controllers/customer.controller.mjs'

const router = Router()

router.get('/', getCustomerByQuery)
router.post('/', addCustomer)
router.put('/:id',  updateCustomer)
router.delete('/:id', deleteCustomer)

export default router;
