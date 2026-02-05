import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { JWTPayload, ResponseType } from '../type/common.type';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private JWTService: JwtService,
    private config: ConfigService,
  ) {}

  async register(
    payload: RegisterDto,
    res: Response,
  ): Promise<ResponseType<Omit<UserEntity, 'password'>>> {
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

    const { password: _password, ...rest } = user;

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    this.setAuthCookies(res, accessToken, refreshToken);

    return {
      success: true,
      message: 'User created successfully',
      data: rest,
      accessToken,
      refreshToken,
    };
  }

  async login(
    payload: LoginDto,
    res: Response,
  ): Promise<ResponseType<Omit<UserEntity, 'password'>>> {
    const user = await this.userRepo.findOne({
      where: { email: payload.email },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials or account not exist',
      );
    }

    const isPasswordValid = bcrypt.compareSync(payload.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid credentials or account not exist',
      );
    }

    const { password: _password, ...rest } = user;

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    this.setAuthCookies(res, accessToken, refreshToken);

    return {
      success: true,
      message: 'User logged in successfully',
      data: rest,
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(
    user: Omit<UserEntity, 'password'>,
  ): Promise<string> {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.JWTService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '30m',
    });
  }

  async generateRefreshToken(
    user: Omit<UserEntity, 'password'>,
  ): Promise<string> {
    const payload = {
      sub: user.id,
    };
    return this.JWTService.signAsync(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 30,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }

  async getUserById(userId: number): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password: _password, ...rest } = user;
    return rest;
  }

  async refreshToken(
    user: JWTPayload,
    res: Response,
  ): Promise<ResponseType<null>> {
    const userData = await this.getUserById(user.sub);

    const accessToken = await this.generateAccessToken(userData);
    const refreshToken = await this.generateRefreshToken(userData);
    this.setAuthCookies(res, accessToken, refreshToken);

    return {
      success: true,
      message: 'Token refreshed successfully',
      data: null,
      accessToken,
      refreshToken,
    };
  }

  logout(res: Response): ResponseType<null> {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return {
      success: true,
      message: 'User logged out successfully',
      data: null,
    };
  }

  async getUserProfile(userId: number) {
    const user = await this.getUserById(userId);
    return {
      success: true,
      message: 'User profile fetched successfully',
      data: user,
    };
  }
}
