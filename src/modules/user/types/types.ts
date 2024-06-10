export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isMale: boolean;
  birthDate: Date;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  token?: string;
  tokenExpiredAt?: Date;
  refreshToken?: string;
  refreshTokenExpiredAt?: Date;
  __v: number;
}
