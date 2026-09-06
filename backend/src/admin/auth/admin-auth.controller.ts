import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Public } from '../../auth/decorators/public.decorator.js';
import { RateLimit } from '../../auth/decorators/rate-limit.decorator.js';
import { AdminAuthService } from './admin-auth.service.js';
import { AdminLoginDto } from './dto/admin-login.dto.js';
import { AdminRefreshDto } from './dto/admin-refresh.dto.js';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Public()
  @RateLimit({ limit: 5, ttlSeconds: 300 }) // Strict: 5 attempts per 5 minutes to prevent brute-forcing
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AdminLoginDto) {
    return this.adminAuthService.login(dto);
  }

  @Public()
  @RateLimit({ limit: 10, ttlSeconds: 60 })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: AdminRefreshDto) {
    return this.adminAuthService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser('id') adminId: string) {
    return this.adminAuthService.logout(adminId);
  }

  @Get('me')
  async getProfile(@CurrentUser('id') adminId: string) {
    return this.adminAuthService.getProfile(adminId);
  }
}
