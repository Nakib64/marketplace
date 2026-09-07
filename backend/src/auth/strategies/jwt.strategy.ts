import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  ACCESS_TOKEN_COOKIE,
  ADMIN_ACCESS_TOKEN_COOKIE,
} from '../utils/cookie.util.js';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  userType?: 'USER' | 'ADMIN';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          if (!request || !request.cookies) {
            return null;
          }
          const url = request.originalUrl || request.url || '';
          if (url.startsWith('/admin')) {
            return (
              request.cookies[ADMIN_ACCESS_TOKEN_COOKIE] ||
              request.cookies[ACCESS_TOKEN_COOKIE] ||
              null
            );
          }
          return (
            request.cookies[ACCESS_TOKEN_COOKIE] ||
            request.cookies[ADMIN_ACCESS_TOKEN_COOKIE] ||
            null
          );
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'fallback_jwt_secret_dev'),
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.userType === 'ADMIN') {
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
        throw new UnauthorizedException('Admin account is inactive or not found.');
      }

      return {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        userType: 'ADMIN' as const,
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true,
        isBanned: true,
      },
    });

    if (!user || user.isBanned) {
      throw new UnauthorizedException('User account is invalid or suspended.');
    }

    return {
      ...user,
      userType: 'USER' as const,
    };
  }
}
