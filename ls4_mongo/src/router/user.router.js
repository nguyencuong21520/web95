import {Router} from 'express';
import UserController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middlewares.js';

const userRouter = Router();

userRouter.get('/', UserController.findAll)
userRouter.post('/login', UserController.login)
userRouter.get('/:id', authMiddleware.authenticate, UserController.findById)
userRouter.post('/', UserController.create)
userRouter.put('/:id', UserController.update)
userRouter.delete('/:id', UserController.delete)

export default userRouter;
