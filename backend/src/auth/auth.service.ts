import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { AuthCredentialsService } from './services/auth-credentials.service.js';
import { AuthTokensService } from './services/auth-tokens.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly credentialsService: AuthCredentialsService,
    private readonly tokensService: AuthTokensService,
  ) {}

  async register(dto: RegisterDto) {
    return this.credentialsService.register(dto);
  }

  async login(dto: LoginDto) {
    const user = await this.credentialsService.validateCredentials(dto);
    const tokens = await this.tokensService.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    return this.tokensService.refreshTokens(refreshToken);
  }

  async logout(userId: string) {
    await this.tokensService.revokeTokens(userId);
    return { message: 'Logged out successfully.' };
  }

  async verifyEmail(identifier: { userId?: string; email?: string }, code?: string) {
    return this.credentialsService.verifyEmail(identifier, code);
  }

  async resendVerification(identifier: { userId?: string; email?: string }) {
    return this.credentialsService.resendVerification(identifier);
  }
}

