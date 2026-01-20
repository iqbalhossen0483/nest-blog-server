import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ResponseType } from '../type/common.type';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserEntity } from './entity/user.entity';

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
}
