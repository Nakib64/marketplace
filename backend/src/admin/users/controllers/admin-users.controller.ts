import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../../auth/decorators/roles.decorator.js';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto.js';
import { UserQueryDto } from '../dto/user-query.dto.js';
import { AdminUsersActionsService } from '../services/admin-users-actions.service.js';
import { AdminUsersQueryService } from '../services/admin-users-query.service.js';

@Roles(Role.ADMIN)
@Controller('admin/users')
export class AdminUsersController {
  constructor(
    private readonly queryService: AdminUsersQueryService,
    private readonly actionsService: AdminUsersActionsService,
  ) {}

  @Get()
  async getUsers(@Query() query: UserQueryDto) {
    return this.queryService.getUsers(query);
  }

  @Get(':id')
  async getUserDossier(@Param('id') id: string) {
    return this.queryService.getUserDossier(id);
  }

  @Patch(':id/status')
  async updateUserStatus(
    @CurrentUser('id') adminId: string,
    @Param('id') targetUserId: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.actionsService.updateUserStatus(adminId, targetUserId, dto);
  }

  @Patch(':id/verify')
  async verifyUserEmail(
    @CurrentUser('id') adminId: string,
    @Param('id') targetUserId: string,
  ) {
    return this.actionsService.verifyUserEmail(adminId, targetUserId);
  }

  @Post(':id/impersonate')
  async impersonateUser(
    @CurrentUser('id') adminId: string,
    @Param('id') targetUserId: string,
  ) {
    return this.actionsService.generateImpersonationToken(adminId, targetUserId);
  }
}
