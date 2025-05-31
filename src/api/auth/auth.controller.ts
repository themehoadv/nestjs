import { SuccessDto } from '@/common/dto/sucess.dto';
import { ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RefreshReqDto } from './dto/refresh.req.dto';
import { RefreshResDto } from './dto/refresh.res.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiPublic({
    type: SuccessDto<LoginResDto>,
    summary: 'Login Email',
  })
  @Post('login')
  async signIn(
    @Body() userLogin: LoginReqDto,
  ): Promise<SuccessDto<LoginResDto>> {
    return await this.authService.signIn(userLogin);
  }

  @ApiPublic({
    type: SuccessDto<RefreshResDto>,
    summary: 'Register Email',
  })
  @Post('register')
  async register(
    @Body() dto: RegisterReqDto,
  ): Promise<SuccessDto<RegisterResDto>> {
    return await this.authService.register(dto);
  }

  @ApiPublic({
    type: SuccessDto<RefreshResDto>,
    summary: 'Refresh token',
  })
  @Post('refresh-token')
  async refresh(
    @Body() dto: RefreshReqDto,
  ): Promise<SuccessDto<RefreshResDto>> {
    return await this.authService.refreshToken(dto);
  }
}
