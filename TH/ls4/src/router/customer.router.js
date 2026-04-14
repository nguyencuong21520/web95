import { Router } from 'express';
import CustomerController from '../controllers/customer.controller.js';
import OrderController from '../controllers/order.controller.js';

const customerRouter = Router();

customerRouter.get('/', CustomerController.findAll)
customerRouter.get('/:customerId/orders', OrderController.findByCustomerId)
customerRouter.post('/', CustomerController.create)
customerRouter.get('/:id', CustomerController.findById)


export default customerRouter;