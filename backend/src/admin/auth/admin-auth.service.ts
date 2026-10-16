import { Injectable } from '@nestjs/common';
import { Enable2FaDto, Login2FaDto, Verify2FaDto } from './dto/admin-2fa.dto.js';
import { AdminLoginDto } from './dto/admin-login.dto.js';
import { Admin2FaSubService } from './services/admin-2fa-sub.service.js';
import { AdminAuthCredentialsSubService } from './services/admin-auth-credentials-sub.service.js';
import { AdminAuthTokensSubService } from './services/admin-auth-tokens-sub.service.js';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly credentialsService: AdminAuthCredentialsSubService,
    private readonly tokensService: AdminAuthTokensSubService,
    private readonly admin2FaService: Admin2FaSubService,
  ) {}

  /**
   * Authenticates staff credentials. If 2FA is active, returns a pre-auth token.
   * Otherwise produces full access and refresh tokens.
   */
  async login(dto: AdminLoginDto) {
    const admin = await this.credentialsService.validateCredentials(dto);

    if (admin.twoFactorEnabled) {
      const preAuthToken = await this.admin2FaService.createPreAuthToken(admin);
      return {
        requires2FA: true as const,
        preAuthToken,
        message: 'Two-factor authentication code required.',
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      };
    }

    const tokens = await this.tokensService.generateTokens(admin);

    return {
      requires2FA: false as const,
      ...tokens,
      admin,
    };
  }

  /**
   * Validates pre-auth token and checks TOTP code for 2FA-enabled staff login.
   */
  async verifyLoginWith2FA(dto: Login2FaDto) {
    return this.admin2FaService.verifyLoginWith2FA(dto.preAuthToken, dto.code);
  }

  /**
   * Generates a new TOTP secret and otpauth URI.
   */
  async generate2FASecret(adminId: string) {
    return this.admin2FaService.generateSecret(adminId);
  }

  /**
   * Confirms code and activates 2FA for the authenticated staff account.
   */
  async enable2FA(adminId: string, dto: Enable2FaDto) {
    return this.admin2FaService.enable2FA(adminId, dto.secret, dto.code);
  }

  /**
   * Verifies code and disables 2FA for the staff account.
   */
  async disable2FA(adminId: string, dto: Verify2FaDto) {
    return this.admin2FaService.disable2FA(adminId, dto.code);
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
