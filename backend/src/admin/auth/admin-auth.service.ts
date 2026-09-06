import { Injectable } from '@nestjs/common';
import { AdminLoginDto } from './dto/admin-login.dto.js';
import { AdminAuthCredentialsSubService } from './services/admin-auth-credentials-sub.service.js';
import { AdminAuthTokensSubService } from './services/admin-auth-tokens-sub.service.js';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly credentialsService: AdminAuthCredentialsSubService,
    private readonly tokensService: AdminAuthTokensSubService,
  ) {}

  /**
   * Authenticates staff credentials and produces access and refresh tokens.
   */
  async login(dto: AdminLoginDto) {
    const admin = await this.credentialsService.validateCredentials(dto);
    const tokens = await this.tokensService.generateTokens(admin);

    return {
      ...tokens,
      admin,
    };
  }

  /**
   * Refreshes admin session tokens using rotation.
   */
  async refreshToken(refreshToken: string) {
    return this.tokensService.refreshTokens(refreshToken);
  }

  /**
   * Revokes staff active session tokens upon logout.
   */
  async logout(adminId: string) {
    await this.tokensService.revokeTokens(adminId);
    return { message: 'Admin logged out successfully.' };
  }

  /**
   * Retrieves profile details of the authenticated staff member.
   */
  async getProfile(adminId: string) {
    return this.credentialsService.getAdminProfile(adminId);
  }
}
