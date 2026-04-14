import { Router } from 'express';
import CustomerController from '../controllers/customer.controller.js';

const customerRouter = Router();

customerRouter.get('/', CustomerController.findAll)
customerRouter.post('/', CustomerController.create)
customerRouter.get('/:id', CustomerController.findById)


export default customerRouter;