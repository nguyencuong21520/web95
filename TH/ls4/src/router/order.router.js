import { Router } from 'express';
import OrderController from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.post('/', OrderController.create)
orderRouter.get('/highvalue', OrderController.getHighValue)

export default orderRouter;