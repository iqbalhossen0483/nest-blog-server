import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, genSaltSync, hashSync } from 'bcrypt-ts';
import { ResponseType } from 'src/type/common.type';
import { Repository } from 'typeorm';
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
      throw new NotFoundException('User already exist');
    }

    const salt = genSaltSync(10);
    const hashPassword = hashSync(payload.password, salt);
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
      throw new NotFoundException('User not exist or invalid credentials');
    }

    const isPasswordValid = compareSync(payload.password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid credentials');
    }

    return {
      success: true,
      message: 'User logged in successfully',
      data: user,
    };
  }
}
