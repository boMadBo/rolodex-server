import dotenv from 'dotenv';
import * as process from 'process';

const nodeEnv = process.env.NODE_ENV || 'development';
let path = nodeEnv === 'development' ? '.env' : `.env.${nodeEnv}`;

dotenv.config({ path });

export const config = {
  baseUrl: process.env.BASE_URI || 'http://localhost',
  api: {
    port: process.env.PORT || 3030,
  },
  mongo: {
    dbUrl: process.env.MONGODB_URI || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'very-secret-key',
    accessExpiration: Number(process.env.JWT_ACCESS_EXPIRATION || 3600),
    refreshExpiration: Number(process.env.JWT_REFRESH_EXPIRATION || 3600 * 24 * 30),
    algorithm: 'HS256',
  },
  uploadUrl: 'http://localhost:3030/api/uploads',
};
