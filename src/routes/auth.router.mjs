import {Router} from 'express'
const router = Router()

import { register} from '../controllers/auth.controller.mjs'

router.post("/register", register);

export default router;