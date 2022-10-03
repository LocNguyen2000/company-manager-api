import { Router } from 'express';
import { addOrder, getOrder, updateOrder, deleteOrder } from '../controllers/orders.controller.mjs';

const router = Router();

router.get('/', getOrder);
router.post('/', addOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
