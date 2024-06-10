import { ExpressRequest, MulterRequest } from '@/shared/types';

export interface CreateUserRequest extends MulterRequest {
  body: {
    firstName: string;
    lastName: string;
    password: string;
    birthDate: string;
    email: string;
    isMale: string;
  };
}

export interface UpdateUserRequest extends ExpressRequest {
  body: {
    firstName: string;
    lastName: string;
    password: string;
  };
}
