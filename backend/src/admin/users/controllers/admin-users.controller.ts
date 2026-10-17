import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../../auth/decorators/roles.decorator.js';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto.js';
import { AdminUpdateClientProfileDto } from '../dto/admin-update-client-profile.dto.js';
import { AdminUpdateFreelancerProfileDto } from '../dto/admin-update-freelancer-profile.dto.js';
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

  @Patch(':id')
  async updateUser(
    @CurrentUser('id') adminId: string,
    @Param('id') targetUserId: string,
    @Body() dto: AdminUpdateUserDto,
  ) {
    return this.actionsService.updateUser(adminId, targetUserId, dto);
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

  @Patch(':id/client-profile')
  async updateClientProfile(
    @CurrentUser('id') adminId: string,
    @Param('id') targetUserId: string,
    @Body() dto: AdminUpdateClientProfileDto,
  ) {
    return this.actionsService.updateClientProfile(adminId, targetUserId, dto);
  }

  @Patch(':id/freelancer-profile')
  async updateFreelancerProfile(
    @CurrentUser('id') adminId: string,
    @Param('id') targetUserId: string,
    @Body() dto: AdminUpdateFreelancerProfileDto,
  ) {
    return this.actionsService.updateFreelancerProfile(adminId, targetUserId, dto);
  }

  @Delete(':id')
  async deleteUser(
    @CurrentUser('id') adminId: string,
    @Param('id') targetUserId: string,
    @Query('reason') reason?: string,
  ) {
    return this.actionsService.deleteUser(adminId, targetUserId, reason);
  }
}
