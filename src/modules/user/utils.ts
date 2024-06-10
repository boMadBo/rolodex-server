import { config } from '@/config';
import { UserCollectionResponse, UserResponse } from '@/modules/user/types/response.types';
import { IUser } from '@/modules/user/types/types';
import { BadRequestError } from '@/shared/errors/badRequestError';
import * as bcrypt from 'bcrypt';

export const generateHash = (password: string): string => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const validateHash = async (password: string, hash: string): Promise<void> => {
  let result = false;
  try {
    result = await bcrypt.compare(password, hash);
  } catch (e) {
    throw new BadRequestError('Invalid username/password');
  }

  if (!result) {
    throw new BadRequestError('Invalid username/password');
  }
};

export const getResponseUser = (user: IUser, id: string): UserResponse | UserCollectionResponse => {
  const { password, avatar, _id, __v, ...userData } = user;

  const avatarUrl = avatar ? `${config.uploadUrl}/${avatar}` : '';
  let result = { id: _id, ...userData, avatar: avatarUrl };

  if (user._id.toString() !== id.toString()) {
    const { token, tokenExpiredAt, refreshToken, refreshTokenExpiredAt, ...allUsersData } = userData;
    result = { id: _id, ...allUsersData, avatar: avatarUrl };
  }

  return result as UserResponse | UserCollectionResponse;
};
