import { config } from '@/config';
import { LoginResponse } from '@/modules/auth/types/response.types';
import { IGetTokens, ITokenPayload } from '@/modules/auth/types/types';
import { IUser } from '@/modules/user/types/types';
import UserSchema from '@/modules/user/user.schema';
import jwt from 'jsonwebtoken';
import moment from 'moment';

const { accessExpiration, refreshExpiration, secret } = config.jwt;

export const updateTokens = async (user: IUser): Promise<LoginResponse> => {
  const tokens = await getTokens({ id: user._id, email: user.email });

  await UserSchema.findOneAndUpdate(
    { _id: user._id },
    {
      $set: {
        token: tokens.accessToken,
        tokenExpiredAt: moment().add(accessExpiration, 'seconds').format('YYYY-MM-DDTHH:mm:ss.SSS'),
        refreshToken: tokens.refreshToken,
        refreshTokenExpiredAt: moment().add(refreshExpiration, 'seconds').format('YYYY-MM-DDTHH:mm:ss.SSS'),
      },
    },
    { new: true }
  );

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    ...tokens,
  };
};

async function getTokens(payload: ITokenPayload): Promise<IGetTokens> {
  return {
    accessToken: await signToken(payload, accessExpiration),
    refreshToken: await signToken(payload, refreshExpiration),
    expiresIn: accessExpiration,
  };
}

async function signToken(payload: ITokenPayload, expiresIn: number): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn, algorithm: 'HS256' }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        if (token) {
          resolve(token);
        } else {
          reject(new Error('Token is undefined'));
        }
      }
    });
  });
}
