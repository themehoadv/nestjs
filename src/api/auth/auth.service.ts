import { SuccessDto } from '@/common/dto/sucess.dto';
import { Branded } from '@/common/types/types';
import { AllConfigType } from '@/config/config.type';
import { ErrorCode } from '@/constants/error-code.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { verifyPassword } from '@/utils/password.util';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import ms from 'ms';
import { Repository } from 'typeorm';
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
    accessToken: string;
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
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Sign in user
   * @param dto LoginReqDto
   * @returns LoginResDto
   */
  async signIn(dto: LoginReqDto): Promise<SuccessDto<LoginResDto>> {
    const { email, password } = dto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    const isPasswordValid =
      user && (await verifyPassword(password, user.password));

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const token = await this.createToken({
      id: user.id,
    });

    return new SuccessDto(
      plainToInstance(LoginResDto, {
        userId: user.id,
        ...token,
      }),
    );
  }

  async register(dto: RegisterReqDto): Promise<SuccessDto<RegisterResDto>> {
    // Check if the user already exists
    const isExistUser = await UserEntity.exists({
      where: { email: dto.email },
    });

    if (isExistUser) {
      throw new ValidationException(ErrorCode.E003);
    }

    // Register user
    const user = new UserEntity({
      email: dto.email,
      password: dto.password,
    });

    await user.save();
    return new SuccessDto(
      plainToInstance(RegisterResDto, {
        userId: user.id,
      }),
    );
  }

  async refreshToken(dto: RefreshReqDto): Promise<RefreshResDto> {
    const { id } = this.verifyRefreshToken(dto.refreshToken);
    const user = await this.userRepository.findOneOrFail({
      where: { id },
      select: ['id'],
    });

    return await this.createToken({
      id: user.id,
    });
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

  private async createToken(data: { id: string }): Promise<Token> {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });
    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: '', // TODO: add role
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          id: data.id,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
      tokenExpires,
    } as Token;
  }
}
