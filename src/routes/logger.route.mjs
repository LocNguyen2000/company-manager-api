import { Router } from 'express';
import { addLog, getLog, updateLog } from '../controllers/logger.controller.mjs';

const router = Router();

router.get('/', getLog);
router.post('/', addLog);
router.put('/:id', updateLog);

export default router;
