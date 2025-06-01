import { SuccessDto } from '@/common/dto/sucess.dto';
import { Branded } from '@/common/types/types';
import { AllConfigType } from '@/config/config.type';
import { ErrorCode } from '@/constants/error-code.constant';
import { RoleType } from '@/constants/role-type';
import { ValidationException } from '@/exceptions/validation.exception';
import { verifyPassword } from '@/utils/password.util';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import ms from 'ms';
import { Repository } from 'typeorm';
import { RoleEntity } from '../role/entities/role.entity';
import { UserEntity } from '../user/entities/user.entity';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RefreshReqDto } from './dto/refresh.req.dto';
import { RefreshResDto } from './dto/refresh.res.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { JwtPayloadType } from './types/jwt-payload.type';
import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';

type Token = Branded<
  {
    token: string;
    refreshToken: string;
    tokenExpires: number;
  },
  'token'
>;

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    @InjectRepository(RoleEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Sign in user
   * @param dto LoginReqDto
   * @returns LoginResDto
   */
  async signIn(dto: LoginReqDto): Promise<SuccessDto<LoginResDto>> {
    const { username, password } = dto;
    const user = await this.userRepository.findOne({
      where: [{ email: username }, { username }],
      select: ['id', 'email', 'username', 'password', 'role'],
    });

    const isPasswordValid =
      user && (await verifyPassword(password, user.password));

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const token = await this.createToken({
      id: user.id,
      role: user.role,
    });

    return new SuccessDto(
      plainToInstance(LoginResDto, {
        userId: user.id,
        ...token,
      }),
    );
  }

  async register(dto: RegisterReqDto): Promise<SuccessDto<RegisterResDto>> {
    // 1. Check if user already exists
    const isExistUser = await UserEntity.exists({
      where: { email: dto.email },
    });

    if (isExistUser) {
      throw new ValidationException(ErrorCode.E003);
    }

    // 2. Find USER role from database
    const userRole = await RoleEntity.findOne({
      where: { name: RoleType.Common },
    });

    if (!userRole) {
      throw new Error('Default USER role not found in database');
    }

    const user = new UserEntity({
      email: dto.email,
      password: dto.password,
      role: userRole,
    });

    await user.save();

    // 4. Return response
    return new SuccessDto(
      plainToInstance(RegisterResDto, {
        userId: user.id,
      }),
    );
  }

  async refreshToken(dto: RefreshReqDto): Promise<SuccessDto<RefreshResDto>> {
    const { id } = this.verifyRefreshToken(dto.refreshToken);
    const user = await this.userRepository.findOneOrFail({
      where: { id },
      select: ['id', 'role'],
    });

    const token = await this.createToken({
      id: user.id,
      role: user.role,
    });

    return new SuccessDto(
      plainToInstance(LoginResDto, {
        userId: user.id,
        ...token,
      }),
    );
  }

  async verifyAccessToken(token: string): Promise<JwtPayloadType> {
    let payload: JwtPayloadType;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
      });
    } catch {
      throw new UnauthorizedException();
    }

    return payload;
  }

  private verifyRefreshToken(token: string): JwtRefreshPayloadType {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.refreshSecret', {
          infer: true,
        }),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async createToken(data: {
    id: string;
    role: { code: string };
  }): Promise<Token> {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });
    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const payload = {
      id: data.id,
      role: data.role?.code,
    };
    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        expiresIn: tokenExpiresIn,
      }),
      await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('auth.refreshSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
          infer: true,
        }),
      }),
    ]);
    return {
      token,
      refreshToken,
      tokenExpires,
    } as Token;
  }
}
