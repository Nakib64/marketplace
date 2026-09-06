import { Module } from '@nestjs/common';
import { AdminAnalyticsModule } from './analytics/admin-analytics.module.js';
import { AdminAuditModule } from './audit/admin-audit.module.js';
import { AdminDisputesModule } from './disputes/admin-disputes.module.js';
import { AdminModerationModule } from './moderation/admin-moderation.module.js';
import { AdminUsersModule } from './users/admin-users.module.js';

@Module({
  imports: [
    AdminAnalyticsModule,
    AdminDisputesModule,
    AdminUsersModule,
    AdminAuditModule,
    AdminModerationModule,
  ],
  exports: [
    AdminAnalyticsModule,
    AdminDisputesModule,
    AdminUsersModule,
    AdminAuditModule,
    AdminModerationModule,
  ],
})
export class AdminModule {}
