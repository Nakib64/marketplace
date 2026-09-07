import { createHash, randomUUID } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { RedisService } from '../../../redis/redis.service.js';

@Injectable()
export class AdminAuthTokensSubService {
  private readonly refreshTtlSeconds = 7 * 24 * 60 * 60; // 7 days

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Generates admin dual tokens using separate secrets and cryptographic salt:
   * - Access Token signed with JWT_ACCESS_SECRET (24h)
   * - Refresh Token signed with JWT_REFRESH_SECRET (7d) containing unique jti salt
   * - Stores SHA-256 hash in Redis for tamper-proof storage
   */
  async generateTokens(admin: { id: string; email: string; role: string }) {
    const accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ||
      this.configService.get<string>('JWT_SECRET', 'fallback_jwt_secret_dev');
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      this.configService.get<string>('JWT_SECRET', 'fallback_jwt_secret_dev');

    const accessPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      userType: 'ADMIN',
    };

    // Cryptographic salt / token ID per issuance
    const salt = randomUUID();
    const refreshPayload = {
      sub: admin.id,
      jti: salt,
      tokenType: 'admin_refresh',
      userType: 'ADMIN',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: accessSecret,
        expiresIn: '24h',
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: refreshSecret,
        expiresIn: '7d',
      }),
    ]);

    // Store SHA-256 hashed token in Redis
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    await this.redis.set(
      `admin:refresh:${admin.id}`,
      tokenHash,
      this.refreshTtlSeconds,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: '24h',
    };
  }

  /**
   * Rotates admin refresh token using JWT_REFRESH_SECRET and verifies account active status.
   */
  async refreshTokens(refreshToken: string) {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      this.configService.get<string>('JWT_SECRET', 'fallback_jwt_secret_dev');

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired admin refresh token.');
    }

    if (payload.tokenType !== 'admin_refresh' || payload.userType !== 'ADMIN' || !payload.sub) {
      throw new UnauthorizedException('Invalid admin refresh token claims.');
    }

    const storedHash = await this.redis.get(`admin:refresh:${payload.sub}`);
    const incomingHash = createHash('sha256').update(refreshToken).digest('hex');

    const isMatch = storedHash === incomingHash || storedHash === refreshToken;

    if (!storedHash || !isMatch) {
      // Possible token theft: revoke immediately
      await this.redis.del(`admin:refresh:${payload.sub}`);
      throw new UnauthorizedException('Admin session revoked or token reused. Please sign in again.');
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!admin || !admin.isActive) {
      await this.redis.del(`admin:refresh:${payload.sub}`);
      throw new UnauthorizedException('Staff account is deactivated or deleted.');
    }

    const tokens = await this.generateTokens(admin);

    return {
      ...tokens,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  /**
   * Revokes the active admin refresh token upon logout.
   */
  async revokeTokens(adminId: string): Promise<void> {
    await this.redis.del(`admin:refresh:${adminId}`);
  }
}
