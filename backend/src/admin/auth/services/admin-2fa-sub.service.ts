import { createHmac, randomBytes } from 'node:crypto';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { AdminAuthTokensSubService } from './admin-auth-tokens-sub.service.js';

@Injectable()
export class Admin2FaSubService {
  private readonly alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokensService: AdminAuthTokensSubService,
  ) {}

  /**
   * Encodes a buffer to Base32 string.
   */
  bufferToBase32(buffer: Buffer): string {
    let bits = 0;
    let value = 0;
    let output = '';

    for (let i = 0; i < buffer.length; i++) {
      value = (value << 8) | buffer[i];
      bits += 8;
      while (bits >= 5) {
        output += this.alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }
    if (bits > 0) {
      output += this.alphabet[(value << (5 - bits)) & 31];
    }
    return output;
  }

  /**
   * Decodes a Base32 string to Buffer.
   */
  base32ToBuffer(base32: string): Buffer {
    const clean = base32.toUpperCase().replace(/=+$/, '');
    let bits = 0;
    let value = 0;
    const bytes: number[] = [];

    for (let i = 0; i < clean.length; i++) {
      const val = this.alphabet.indexOf(clean[i]);
      if (val === -1) continue;
      value = (value << 5) | val;
      bits += 5;
      if (bits >= 8) {
        bytes.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }
    return Buffer.from(bytes);
  }

  /**
   * Calculates RFC 6238 TOTP 6-digit code for a given secret and drift step.
   */
  calculateTOTP(secretBase32: string, timeStepOffset = 0): string {
    const key = this.base32ToBuffer(secretBase32);
    const epoch = Math.floor(Date.now() / 1000);
    const timeStep = Math.floor(epoch / 30) + timeStepOffset;

    const timeBuffer = Buffer.alloc(8);
    timeBuffer.writeBigUInt64BE(BigInt(timeStep));

    const hmac = createHmac('sha1', key).update(timeBuffer).digest();
    const offset = hmac[hmac.length - 1] & 0x0f;
    const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000;
    return code.toString().padStart(6, '0');
  }

  /**
   * Verifies a 6-digit TOTP code against a secret with ±1 time-step drift tolerance.
   */
  verifyTOTP(secretBase32: string, code: string): boolean {
    if (!secretBase32 || !code || code.trim().length !== 6) {
      return false;
    }
    const sanitizedCode = code.trim();
    for (const drift of [-1, 0, 1]) {
      if (this.calculateTOTP(secretBase32, drift) === sanitizedCode) {
        return true;
      }
    }
    return false;
  }

  /**
   * Generates a new Base32 TOTP secret and standard otpauth URL for Google Authenticator / Authy.
   */
  async generateSecret(adminId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, email: true, twoFactorEnabled: true },
    });

    if (!admin) {
      throw new NotFoundException('Staff account not found.');
    }

    const secretBytes = randomBytes(20);
    const secret = this.bufferToBase32(secretBytes);
    const issuer = 'MarketplaceAdmin';
    const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(admin.email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

    return {
      secret,
      otpauthUrl,
      twoFactorEnabled: admin.twoFactorEnabled,
    };
  }

  /**
   * Verifies the setup code and activates 2FA for the staff member.
   */
  async enable2FA(adminId: string, secret: string, code: string) {
    const isValid = this.verifyTOTP(secret, code);
    if (!isValid) {
      throw new BadRequestException('Invalid two-factor authentication code. Verification failed.');
    }

    await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        twoFactorSecret: secret,
        twoFactorEnabled: true,
      },
    });

    return {
      message: 'Two-factor authentication successfully enabled.',
      twoFactorEnabled: true,
    };
  }

  /**
   * Disables 2FA on the staff account after verifying the current 6-digit code.
   */
  async disable2FA(adminId: string, code: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!admin || !admin.twoFactorEnabled || !admin.twoFactorSecret) {
      throw new BadRequestException('Two-factor authentication is not currently enabled.');
    }

    const isValid = this.verifyTOTP(admin.twoFactorSecret, code);
    if (!isValid) {
      throw new BadRequestException('Invalid two-factor authentication code.');
    }

    await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        twoFactorSecret: null,
        twoFactorEnabled: false,
      },
    });

    return {
      message: 'Two-factor authentication successfully disabled.',
      twoFactorEnabled: false,
    };
  }

  /**
   * Signs a short-lived pre-auth token (5 minutes) when 2FA is required during login.
   */
  async createPreAuthToken(admin: { id: string; email: string }) {
    const secret =
      this.configService.get<string>('JWT_ADMIN_ACCESS_SECRET') ||
      this.configService.get<string>('JWT_SECRET', 'fallback_jwt_secret_dev');

    return this.jwtService.signAsync(
      {
        sub: admin.id,
        email: admin.email,
        tokenType: 'admin_pre_auth',
        userType: 'ADMIN',
      },
      {
        secret,
        expiresIn: '5m',
      },
    );
  }

  /**
   * Validates pre-auth token and checks TOTP code, returning full admin session tokens upon success.
   */
  async verifyLoginWith2FA(preAuthToken: string, code: string) {
    const secret =
      this.configService.get<string>('JWT_ADMIN_ACCESS_SECRET') ||
      this.configService.get<string>('JWT_SECRET', 'fallback_jwt_secret_dev');

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(preAuthToken, { secret });
    } catch {
      throw new UnauthorizedException('Pre-authentication session expired or invalid. Please log in again.');
    }

    if (payload.tokenType !== 'admin_pre_auth' || payload.userType !== 'ADMIN' || !payload.sub) {
      throw new UnauthorizedException('Invalid pre-authentication token claims.');
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id: payload.sub },
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Staff account is inactive or not found.');
    }

    if (!admin.twoFactorEnabled || !admin.twoFactorSecret) {
      throw new BadRequestException('Two-factor authentication is not configured for this account.');
    }

    const isValid = this.verifyTOTP(admin.twoFactorSecret, code);
    if (!isValid) {
      throw new UnauthorizedException('Invalid 6-digit two-factor authentication code.');
    }

    const tokens = await this.tokensService.generateTokens(admin);

    return {
      ...tokens,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive,
        twoFactorEnabled: admin.twoFactorEnabled,
      },
    };
  }
}
