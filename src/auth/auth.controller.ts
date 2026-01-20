import { Body, Controller, Post } from '@nestjs/common';
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
  ): Promise<ResponseType<Omit<UserEntity, 'password'>>> {
    console.log(payload);
    return this.authService.register(payload);
  }

  @Post('login')
  async login(
    @Body() payload: LoginDto,
  ): Promise<ResponseType<Omit<UserEntity, 'password'>>> {
    return this.authService.login(payload);
  }
}
