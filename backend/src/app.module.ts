import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { RateLimitGuard } from './auth/guards/rate-limit.guard.js';
import { EmailVerifiedGuard } from './auth/guards/email-verified.guard.js';
import { PrismaModule } from './prisma/prisma.module.js';

import { AdminModule } from './admin/admin.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { ContractsModule } from './contracts/contracts.module.js';
import { JobsModule } from './jobs/jobs.module.js';
import { ProposalsModule } from './proposals/proposals.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { UsersModule } from './users/users.module.js';
import { WalletModule } from './wallet/wallet.module.js';
import { ChatModule } from './chat/chat.module.js';
import { RedisModule } from './redis/redis.module.js';
import { QueuesModule } from './queues/queues.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,
    QueuesModule,
    AuthModule,
    UsersModule,
    JobsModule,
    CategoriesModule,
    ProposalsModule,
    ContractsModule,
    ReviewsModule,
    WalletModule,
    AdminModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: EmailVerifiedGuard,
    },
  ],
})
export class AppModule {}
