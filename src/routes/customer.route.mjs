import {Router} from 'express'

import { addCustomer, deleteCustomer, getCustomer, updateCustomer } from '../controllers/customer.controller.mjs'

const router = Router()

router.get('/', getCustomer)
router.post('/', addCustomer)
router.put('/:id',  updateCustomer)
router.delete('/:id', deleteCustomer)

export default router;
