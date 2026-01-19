import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { ResponseType } from '../type/common.type';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async register(payload: RegisterDto): Promise<ResponseType<UserEntity>> {
    const isExist = await this.userRepo.findOne({
      where: { email: payload.email },
    });
    if (isExist) {
      throw new ConflictException('User already exist');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(payload.password, salt);
    payload.password = hashPassword;
    const user = await this.userRepo.save(payload);

    return {
      success: true,
      message: 'User created successfully',
      data: user,
    };
  }

  async login(payload: LoginDto): Promise<ResponseType<UserEntity>> {
    const user = await this.userRepo.findOne({
      where: { email: payload.email },
    });

    if (!user) {
      throw new UnauthorizedException('User not exist or invalid credentials');
    }

    const isPasswordValid = bcrypt.compareSync(payload.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      success: true,
      message: 'User logged in successfully',
      data: user,
    };
  }
}
