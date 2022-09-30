import { Router } from 'express'

const router = Router()

import { getProduct, addProduct, updateProduct, deleteProduct } from '../controllers/product.controller.mjs'
import {verifyToken, isAccess} from '../middlewares/authenticate.mjs'
router.get('/',verifyToken, getProduct)
router.post('/',verifyToken, addProduct)
router.put('/:id',verifyToken, updateProduct)
router.delete('/:id',verifyToken, deleteProduct)

export default router;
