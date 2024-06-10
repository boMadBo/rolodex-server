import { AuthController } from '@/modules/auth/auth.controller';
import { authMiddleware } from '@/shared/middleware/auth.middleware';
import { Router } from 'express';

const authRouter = Router();
const authController = AuthController();

authRouter.post('/auth/login', authController.login);
authRouter.put('/auth/refresh', authController.refreshTokens);
authRouter.delete('/auth/logout', authMiddleware, authController.logout);

export default authRouter;
