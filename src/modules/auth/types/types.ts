export interface ITokenPayload {
  id: string;
  email: string;
}

export interface IGetTokens {
  refreshToken: string;
  accessToken: string;
  expiresIn: number;
}
