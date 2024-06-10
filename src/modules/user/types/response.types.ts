import { IUser } from '@/modules/user/types/types';

export type UserResponse = Omit<Omit<IUser, 'password' | '__v'>, '_id'> & {
  id: IUser['_id'];
};

export type UserCollectionResponse = Omit<
  UserResponse,
  'token' | 'tokenExpiredAt' | 'refreshToken' | 'refreshTokenExpiredAt'
>;
