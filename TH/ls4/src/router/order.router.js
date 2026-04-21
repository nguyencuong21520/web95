import { Router } from 'express';
import OrderController from '../controllers/order.controller.js';
import orderValidateMiddleware from '../middlewares/orderValidate.middleware.js';
const orderRouter = Router();

orderRouter.post('/', orderValidateMiddleware, OrderController.create)
orderRouter.get('/highvalue', OrderController.getHighValue)
orderRouter.put('/:orderId', OrderController.updateQuantity)
orderRouter.get('/customer/:customerId', OrderController.getOrdersByCustomerId)

export default orderRouter;