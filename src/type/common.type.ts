import { Request } from 'express';
import { UserRole } from 'src/entities/user.entity';

export interface ResponseType<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    total: number;
    last_page: number;
  };
  accessToken?: string;
  refreshToken?: string;
}

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
