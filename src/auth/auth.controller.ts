import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '../common/guard/auth.guard';
import { UserEntity } from '../entities/user.entity';
import type { AuthenticatedRequest, ResponseType } from '../type/common.type';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() payload: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<Omit<UserEntity, 'password'>>> {
    return this.authService.register(payload, res);
  }

  @Post('login')
  async login(
    @Body() payload: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<Omit<UserEntity, 'password'>>> {
    return this.authService.login(payload, res);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  userProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<ResponseType<Omit<UserEntity, 'password'>>> {
    return this.authService.getUserProfile(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('refresh')
  async refreshToken(
    @Request() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType<null>> {
    return this.authService.refreshToken(req.user, res);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response): ResponseType<null> {
    return this.authService.logout(res);
  }
}
