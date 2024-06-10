import { IUser } from '@/modules/user/types/types';
import { Request } from 'express';

export interface ExpressRequest extends Request {
  user?: IUser;
  token?: string;
}

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}
