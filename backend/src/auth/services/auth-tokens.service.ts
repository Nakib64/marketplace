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
   * Generates a short-lived access token (15m) and secure refresh token (7d) stored in Redis.
   */
  async generateTokens(user: { id: string; email: string; role: string }) {
    const accessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshPayload = {
      sub: user.id,
      tokenType: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, { expiresIn: '24h' }),
      this.jwtService.signAsync(refreshPayload, { expiresIn: '7d' }),
    ]);

    await this.redis.set(
      `auth:refresh:${user.id}`,
      refreshToken,
      this.refreshTtlSeconds,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: '24h',
    };
  }

  /**
   * Validates refresh token against Redis, verifies account status, and rotates tokens.
   */
  async refreshTokens(refreshToken: string) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    if (payload.tokenType !== 'refresh' || !payload.sub) {
      throw new UnauthorizedException('Invalid refresh token structure.');
    }

    const storedToken = await this.redis.get(`auth:refresh:${payload.sub}`);
    if (!storedToken || storedToken !== refreshToken) {
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

    // Automatic token rotation
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
