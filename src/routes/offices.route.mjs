import {Router} from 'express'

import { addOffice, deleteOffice, getOffice, updateOffice } from '../controllers/offices.controller.mjs'
import {verifyToken, isAccess} from '../middlewares/authenticate.mjs'
const router = Router()

router.get('/',verifyToken,  getOffice)
router.post('/',verifyToken,  addOffice)
router.put('/:id',verifyToken, updateOffice)
router.delete('/:id',verifyToken, deleteOffice)

export default router;
