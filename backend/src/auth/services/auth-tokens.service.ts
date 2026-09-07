import { createHash, randomUUID } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';

@Injectable()
export class AuthTokensService {
  private readonly refreshTtlSeconds = 7 * 24 * 60 * 60; // 7 days

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Generates dual tokens using separate secrets and cryptographic salt:
   * - Access Token signed with JWT_ACCESS_SECRET (24h)
   * - Refresh Token signed with JWT_REFRESH_SECRET (7d) containing unique jti salt
   * - Stores SHA-256 hash in Redis for tamper-proof storage
   */
  async generateTokens(user: { id: string; email: string; role: string }) {
    const accessSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ||
      this.configService.get<string>('JWT_SECRET', 'fallback_jwt_secret_dev');
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ||
      this.configService.get<string>('JWT_SECRET', 'fallback_jwt_secret_dev');

    const accessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Cryptographic salt / token ID per issuance
    const salt = randomUUID();
    const refreshPayload = {
      sub: user.id,
      jti: salt,
      tokenType: 'refresh',
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
      `auth:refresh:${user.id}`,
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
   * Validates refresh token using JWT_REFRESH_SECRET against hashed Redis value,
   * verifies account status, and rotates tokens with fresh salt.
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
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    if (payload.tokenType !== 'refresh' || !payload.sub) {
      throw new UnauthorizedException('Invalid refresh token structure.');
    }

    const storedHash = await this.redis.get(`auth:refresh:${payload.sub}`);
    const incomingHash = createHash('sha256').update(refreshToken).digest('hex');

    // Matches hash or plaintext for backwards compatibility
    const isMatch = storedHash === incomingHash || storedHash === refreshToken;

    if (!storedHash || !isMatch) {
      // Possible token reuse / breach: revoke token family
      await this.redis.del(`auth:refresh:${payload.sub}`);
      throw new UnauthorizedException(
        'Refresh token has already been used or revoked. Please log in again.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        isBanned: true,
        isEmailVerified: true,
      },
    });

    if (!user || user.isBanned) {
      await this.redis.del(`auth:refresh:${payload.sub}`);
      throw new UnauthorizedException('User account is invalid or suspended.');
    }

    // Automatic token rotation with new salt
    const tokens = await this.generateTokens(user);

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

  /**
   * Revokes the active refresh token for a user.
   */
  async revokeTokens(userId: string): Promise<void> {
    await this.redis.del(`auth:refresh:${userId}`);
  }
}
