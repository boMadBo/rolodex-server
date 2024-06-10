import { multerOptions } from '@/multer.options';
import { authMiddleware } from '@/shared/middleware/auth.middleware';
import express, { Router } from 'express';
import multer from 'multer';
import { UserController } from './user.controller';

const userRouter = Router();
const userController = UserController();
const upload = multer(multerOptions);
userRouter.use('/uploads', express.static('src/uploads'));

userRouter.post('/user', upload.single('file'), userController.create);
userRouter.get('/user', authMiddleware, userController.getUser);
userRouter.patch('/user', authMiddleware, upload.single('file'), userController.updateUser);
userRouter.get('/user/list', authMiddleware, userController.getList);

export default userRouter;
