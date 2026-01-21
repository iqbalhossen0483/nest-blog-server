import { Request } from 'express';
import { UserRole } from '../entity/user.entity';

export interface JWTPayload {
  sub: number;
  email: string;
  role: UserRole;
}
export interface AuthenticatedRequest extends Request {
  user: JWTPayload;
  cookies: {
    accessToken?: string;
    refreshToken?: string;
  };
}
