import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { UpdateClientProfileDto } from '../dto/update-client-profile.dto.js';
import { UpdateFreelancerProfileDto } from '../dto/update-freelancer-profile.dto.js';
import { UsersService } from '../services/users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMyProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getUserProfile(userId);
  }

  @Roles(Role.CLIENT)
  @Patch('me/client-profile')
  async updateMyClientProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateClientProfileDto,
  ) {
    return this.usersService.updateClientProfile(userId, dto);
  }

  @Roles(Role.FREELANCER)
  @Patch('me/freelancer-profile')
  async updateMyFreelancerProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateFreelancerProfileDto,
  ) {
    return this.usersService.updateFreelancerProfile(userId, dto);
  }
}
