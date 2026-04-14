import {Router} from 'express';
import ProductController from '../controllers/product.controller.js';

const productRouter = Router();

productRouter.get('/', ProductController.findAll)
productRouter.post('/', ProductController.create)

export default productRouter;