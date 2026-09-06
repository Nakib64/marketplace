import { Module } from '@nestjs/common';
import { ReviewsModule } from '../../reviews/reviews.module.js';
import { AdminAuditModule } from '../audit/admin-audit.module.js';
import { AdminModerationController } from './controllers/admin-moderation.controller.js';
import { AdminModerationService } from './services/admin-moderation.service.js';
import { AntiCircumventionService } from './services/anti-circumvention.service.js';

@Module({
  imports: [ReviewsModule, AdminAuditModule],
  controllers: [AdminModerationController],
  providers: [AdminModerationService, AntiCircumventionService],
  exports: [AdminModerationService, AntiCircumventionService],
})
export class AdminModerationModule {}
