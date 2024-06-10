import { IUser } from '@/modules/user/types/types';
import { UserController } from '@/modules/user/user.controller';
import { ExpressRequest } from '@/shared/types';
import { NextFunction, Response } from 'express';

const userController = UserController();

export const authMiddleware = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = undefined;
    next();
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const userDocument = await userController.findByToken(token);
    if (userDocument && userDocument !== undefined) {
      req.user = userDocument.toObject() as IUser;
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};
