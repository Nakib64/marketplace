import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module.js';
import { AdminAuditModule } from '../audit/admin-audit.module.js';
import { AdminUsersController } from './controllers/admin-users.controller.js';
import { AdminUsersActionsService } from './services/admin-users-actions.service.js';
import { AdminUsersQueryService } from './services/admin-users-query.service.js';

@Module({
  imports: [AuthModule, AdminAuditModule],
  controllers: [AdminUsersController],
  providers: [AdminUsersQueryService, AdminUsersActionsService],
  exports: [AdminUsersQueryService, AdminUsersActionsService],
})
export class AdminUsersModule {}
