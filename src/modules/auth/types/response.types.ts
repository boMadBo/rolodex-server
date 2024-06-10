export interface LoginResponse {
  id: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
