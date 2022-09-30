import { Router } from 'express'

const router = Router()

import { getProduct, addProduct, updateProduct, deleteProduct } from '../controllers/product.controller.mjs'

router.get('/', getProduct)
router.post('/', addProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router;
