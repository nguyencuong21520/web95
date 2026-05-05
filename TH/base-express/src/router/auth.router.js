import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { singleImageUpload } from '../middlewares/uploadfile.middleware.js';

const authRouter = Router();

authRouter.post('/login', AuthController.login)
authRouter.post('/register', AuthController.register)
authRouter.get('/me', authMiddleware.authenticate, AuthController.getProfile)
authRouter.post('/profile', authMiddleware.authenticate, AuthController.createProfile)
authRouter.put('/me', authMiddleware.authenticate, singleImageUpload('avatar'), AuthController.updateProfile)

export default authRouter;
