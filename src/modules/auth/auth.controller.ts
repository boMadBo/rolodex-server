import { LoginRequest, RefreshTokensRequest } from '@/modules/auth/types/request.types';
import { updateTokens } from '@/modules/auth/utils';
import { UserController } from '@/modules/user/user.controller';
import { ExpressRequest } from '@/shared/types';
import { Response } from 'express';

const userController = UserController();

const login = async (req: LoginRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await userController.login(email, password);
    const result = await updateTokens(user);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to login' });
  }
};

const refreshTokens = async (req: RefreshTokensRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const user = await userController.getUserByRefreshToken(refreshToken);
    const result = await updateTokens(user);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to refresh tokens' });
  }
};

const logout = async (req: ExpressRequest, res: Response): Promise<void> => {
  if (!req.user) {
    return;
  }

  const result = await userController.logout(req.user._id);
  res.json(result);
};

export const AuthController = () => {
  return {
    login,
    refreshTokens,
    logout,
  };
};
