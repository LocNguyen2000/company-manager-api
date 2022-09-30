import {Router} from 'express'

import { addProductLine, deleteProductLine, getProductLine, updateProductLine } from '../controllers/product-lines.controller.mjs'

const router = Router()

router.get('/',  getProductLine)
router.post('/',  addProductLine)
router.put('/:id', updateProductLine)
router.delete('/:id', deleteProductLine)

export default router;
