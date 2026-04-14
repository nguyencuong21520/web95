import {Router} from 'express';
import UserController from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get('/', UserController.findAll)
userRouter.get('/:id',  UserController.findById)
userRouter.post('/', UserController.create)
userRouter.put('/:id', UserController.update)
userRouter.delete('/:id', UserController.delete)

export default userRouter;
