import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { RedisService } from '../../../redis/redis.service.js';

@Injectable()
export class AdminAuthTokensSubService {
  // Staff refresh tokens expire in 24 hours for enhanced enterprise security
  private readonly refreshTtlSeconds = 24 * 60 * 60;

  constructor(
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Generates admin dual tokens (15m access + 24h refresh) tagged with userType: 'ADMIN'.
   */
  async generateTokens(admin: { id: string; email: string; role: string }) {
    const accessPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      userType: 'ADMIN',
    };

    const refreshPayload = {
      sub: admin.id,
      tokenType: 'admin_refresh',
      userType: 'ADMIN',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, { expiresIn: '24h' }),
      this.jwtService.signAsync(refreshPayload, { expiresIn: '7d' }),
    ]);

    await this.redis.set(
      `admin:refresh:${admin.id}`,
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
   * Rotates admin refresh token and verifies account active status.
   */
  async refreshTokens(refreshToken: string) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired admin refresh token.');
    }

    if (payload.tokenType !== 'admin_refresh' || payload.userType !== 'ADMIN' || !payload.sub) {
      throw new UnauthorizedException('Invalid admin refresh token claims.');
    }

    const storedToken = await this.redis.get(`admin:refresh:${payload.sub}`);
    if (!storedToken || storedToken !== refreshToken) {
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
