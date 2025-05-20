import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  ForgotPassordReqDto,
  ForgotPasswordResDto,
  LoginReqDto,
  LoginResDto,
  RefreshReqDto,
  RefreshResDto,
  RegisterReqDto,
  RegisterResDto,
  ResetPasswordReqDto,
  ResetPasswordResDto,
} from './dto/index';
import { JwtPayloadType } from './types/jwt-payload.type';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiPublic({
    type: LoginResDto,
    summary: 'Sign in',
  })
  @Post('email/login')
  async signIn(@Body() userLogin: LoginReqDto): Promise<LoginResDto> {
    return await this.authService.signIn(userLogin);
  }

  @ApiPublic({
    type: RegisterResDto,
    summary: 'Sign up',
  })
  @Post('email/register')
  async register(@Body() dto: RegisterReqDto): Promise<RegisterResDto> {
    return await this.authService.register(dto);
  }

  @ApiAuth({
    summary: 'Logout',
    errorResponses: [400, 401, 403, 500],
  })
  @Post('logout')
  async logout(@CurrentUser() userToken: JwtPayloadType): Promise<void> {
    await this.authService.logout(userToken);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: 'Refresh token',
  })
  @Post('refresh')
  async refresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return await this.authService.refreshToken(dto);
  }

  @ApiPublic({
    type: ForgotPasswordResDto,
    summary: 'Forgot password',
  })
  @Post('forgot-password')
  async forgotPassword(
    @Body() { email }: ForgotPassordReqDto,
  ): Promise<ForgotPasswordResDto> {
    return await this.authService.forgotPassword(email);
  }
  @ApiPublic({
    type: ResetPasswordResDto,
    summary: 'Reset password',
  })
  @Post('reset-password')
  async resetPassword(@Body() { token, password }: ResetPasswordReqDto) {
    return await this.authService.resetPassword(token, password);
  }
  @ApiPublic({
    summary: 'Verify email',
  })
  @Get('verify/email')
  async verifyEmail(@Query('token') token: string) {
    await this.authService.verifyEmail(token);
    return { message: 'Email verified successfully' };
  }
  @ApiPublic()
  @Post('verify/forgot-password')
  async verifyForgotPassword() {
    return 'verify-forgot-password';
  }

  @ApiPublic()
  @Post('verify/email/resend')
  async resendVerifyEmail() {
    return 'resend-verify-email';
  }
}
