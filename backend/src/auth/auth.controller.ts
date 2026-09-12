import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { Public } from './decorators/public.decorator.js';
import { RateLimit } from './decorators/rate-limit.decorator.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  getClearCookieOptions,
  getCookieOptions,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE,
} from './utils/cookie.util.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @RateLimit({ limit: 3, ttlSeconds: 60 })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @RateLimit({ limit: 5, ttlSeconds: 60 })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie(
      ACCESS_TOKEN_COOKIE,
      result.accessToken,
      getCookieOptions(ACCESS_TOKEN_MAX_AGE),
    );
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      result.refreshToken,
      getCookieOptions(REFRESH_TOKEN_MAX_AGE),
    );

    return {
      message: 'Login successful',
      user: result.user,
    };
  }

  @Public()
  @RateLimit({ limit: 10, ttlSeconds: 60 })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.[REFRESH_TOKEN_COOKIE] || dto?.refreshToken;
    if (!token) {
      throw new UnauthorizedException('Refresh token is required.');
    }

    const result = await this.authService.refreshToken(token);

    res.cookie(
      ACCESS_TOKEN_COOKIE,
      result.accessToken,
      getCookieOptions(ACCESS_TOKEN_MAX_AGE),
    );
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      result.refreshToken,
      getCookieOptions(REFRESH_TOKEN_MAX_AGE),
    );

    return {
      message: 'Token refreshed successfully',
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie(ACCESS_TOKEN_COOKIE, getClearCookieOptions());
    res.clearCookie(REFRESH_TOKEN_COOKIE, getClearCookieOptions());
    return this.authService.logout(userId);
  }

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @CurrentUser('id') authUserId: string | undefined,
    @Body() dto: VerifyEmailDto,
  ) {
    return this.authService.verifyEmail(
      { userId: authUserId, email: dto?.email },
      dto?.code,
    );
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(
    @CurrentUser('id') authUserId: string | undefined,
    @Body() dto: VerifyEmailDto,
  ) {
    return this.authService.resendVerification({
      userId: authUserId,
      email: dto?.email,
    });
  }
}

