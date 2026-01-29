import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Configaration } from 'src/config/configaration';
import { AuthenticatedRequest, JWTPayload } from './interface/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token =
      request.cookies?.accessToken ?? this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Unauthorized user');
    }
    try {
      const payload = await this.jwtService.verifyAsync<JWTPayload>(token, {
        secret: Configaration.jwtSecret,
      });
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(
    request: AuthenticatedRequest,
  ): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
