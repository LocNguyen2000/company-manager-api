import {Router} from 'express'

import { addProductLine, deleteProductLine, getProductLine, updateProductLine } from '../controllers/product-lines.controller.mjs'
import {verifyToken, isAccess} from '../middlewares/authenticate.mjs'
const router = Router()

router.get('/',verifyToken,  getProductLine)
router.post('/',verifyToken,  addProductLine)
router.put('/:id',verifyToken, updateProductLine)
router.delete('/:id',verifyToken, deleteProductLine)

export default router;
