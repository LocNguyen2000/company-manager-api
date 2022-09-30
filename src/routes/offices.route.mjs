import {Router} from 'express'

import { addOffice, deleteOffice, getOffice, updateOffice } from '../controllers/offices.controller.mjs'

const router = Router()

router.get('/',  getOffice)
router.post('/',  addOffice)
router.put('/:id', updateOffice)
router.delete('/:id', deleteOffice)

export default router;
