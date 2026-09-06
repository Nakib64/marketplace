import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { RedisModule } from '../../redis/redis.module.js';
import { AdminAuthController } from './admin-auth.controller.js';
import { AdminAuthService } from './admin-auth.service.js';
import { AdminAuthCredentialsSubService } from './services/admin-auth-credentials-sub.service.js';
import { AdminAuthTokensSubService } from './services/admin-auth-tokens-sub.service.js';

@Module({
  imports: [PrismaModule, RedisModule, AuthModule],
  controllers: [AdminAuthController],
  providers: [
    AdminAuthCredentialsSubService,
    AdminAuthTokensSubService,
    AdminAuthService,
  ],
  exports: [
    AdminAuthCredentialsSubService,
    AdminAuthTokensSubService,
    AdminAuthService,
  ],
})
export class AdminAuthModule {}
