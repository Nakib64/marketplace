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
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Public } from '../../auth/decorators/public.decorator.js';
import { RateLimit } from '../../auth/decorators/rate-limit.decorator.js';
import {
  ACCESS_TOKEN_MAX_AGE,
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
  getClearCookieOptions,
  getCookieOptions,
  REFRESH_TOKEN_MAX_AGE,
} from '../../auth/utils/cookie.util.js';
import { AdminAuthService } from './admin-auth.service.js';
import { Enable2FaDto, Login2FaDto, Verify2FaDto } from './dto/admin-2fa.dto.js';
import { AdminLoginDto } from './dto/admin-login.dto.js';
import { AdminRefreshDto } from './dto/admin-refresh.dto.js';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Public()
  @RateLimit({ limit: 5, ttlSeconds: 300 }) // Strict: 5 attempts per 5 minutes to prevent brute-forcing
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: AdminLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.adminAuthService.login(dto);

    if (result.requires2FA) {
      return {
        requires2FA: true,
        preAuthToken: result.preAuthToken,
        message: result.message,
        admin: result.admin,
      };
    }

    res.cookie(
      ADMIN_ACCESS_TOKEN_COOKIE,
      result.accessToken,
      getCookieOptions(ACCESS_TOKEN_MAX_AGE),
    );
    res.cookie(
      ADMIN_REFRESH_TOKEN_COOKIE,
      result.refreshToken,
      getCookieOptions(REFRESH_TOKEN_MAX_AGE),
    );

    return {
      requires2FA: false,
      message: 'Admin login successful',
      admin: result.admin,
    };
  }

  @Public()
  @RateLimit({ limit: 5, ttlSeconds: 300 })
  @Post('2fa/verify-login')
  @HttpCode(HttpStatus.OK)
  async verifyLoginWith2FA(
    @Body() dto: Login2FaDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.adminAuthService.verifyLoginWith2FA(dto);

    res.cookie(
      ADMIN_ACCESS_TOKEN_COOKIE,
      result.accessToken,
      getCookieOptions(ACCESS_TOKEN_MAX_AGE),
    );
    res.cookie(
      ADMIN_REFRESH_TOKEN_COOKIE,
      result.refreshToken,
      getCookieOptions(REFRESH_TOKEN_MAX_AGE),
    );

    return {
      message: 'Two-factor authentication verified successfully',
      admin: result.admin,
    };
  }

  @Post('2fa/generate')
  @HttpCode(HttpStatus.OK)
  async generate2FASecret(@CurrentUser('id') adminId: string) {
    return this.adminAuthService.generate2FASecret(adminId);
  }

  @Post('2fa/enable')
  @HttpCode(HttpStatus.OK)
  async enable2FA(
    @CurrentUser('id') adminId: string,
    @Body() dto: Enable2FaDto,
  ) {
    return this.adminAuthService.enable2FA(adminId, dto);
  }

  @Post('2fa/disable')
  @HttpCode(HttpStatus.OK)
  async disable2FA(
    @CurrentUser('id') adminId: string,
    @Body() dto: Verify2FaDto,
  ) {
    return this.adminAuthService.disable2FA(adminId, dto);
  }

  @Public()
  @RateLimit({ limit: 10, ttlSeconds: 60 })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Body() dto: AdminRefreshDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.[ADMIN_REFRESH_TOKEN_COOKIE] || dto?.refreshToken;
    if (!token) {
      throw new UnauthorizedException('Admin refresh token is required.');
    }

    const result = await this.adminAuthService.refreshToken(token);

    res.cookie(
      ADMIN_ACCESS_TOKEN_COOKIE,
      result.accessToken,
      getCookieOptions(ACCESS_TOKEN_MAX_AGE),
    );
    res.cookie(
      ADMIN_REFRESH_TOKEN_COOKIE,
      result.refreshToken,
      getCookieOptions(REFRESH_TOKEN_MAX_AGE),
    );

    return {
      message: 'Admin token refreshed successfully',
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser('id') adminId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie(ADMIN_ACCESS_TOKEN_COOKIE, getClearCookieOptions());
    res.clearCookie(ADMIN_REFRESH_TOKEN_COOKIE, getClearCookieOptions());
    return this.adminAuthService.logout(adminId);
  }

  @Get('me')
  async getProfile(@CurrentUser('id') adminId: string) {
    return this.adminAuthService.getProfile(adminId);
  }
}
