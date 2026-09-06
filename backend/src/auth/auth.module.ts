import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { EmailVerifiedGuard } from './guards/email-verified.guard.js';
import { RateLimitGuard } from './guards/rate-limit.guard.js';
import { AuthCredentialsService } from './services/auth-credentials.service.js';
import { AuthTokensService } from './services/auth-tokens.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'fallback_jwt_secret_dev'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') || '15m') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthCredentialsService,
    AuthTokensService,
    AuthService,
    JwtStrategy,
    RateLimitGuard,
    EmailVerifiedGuard,
  ],
  exports: [
    AuthCredentialsService,
    AuthTokensService,
    AuthService,
    JwtStrategy,
    RateLimitGuard,
    EmailVerifiedGuard,
    PassportModule,
    JwtModule,
  ],
})
export class AuthModule {}
