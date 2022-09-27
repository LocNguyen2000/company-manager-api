import { Router } from 'express'
import { addOffice } from '../controllers/offices.controller.mjs';

const router = Router()

router.post('/', addOffice)

export default router;
