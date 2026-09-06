import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { UpdatePlatformFeeDto } from '../dto/update-platform-fee.dto.js';
import { ContractsService } from '../services/contracts.service.js';

@Roles(Role.ADMIN)
@Controller('admin/settings')
export class AdminSettingsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get('platform-fee')
  async getPlatformFee() {
    const percentage = await this.contractsService.getPlatformFeePercentage();
    return { platformFeePercentage: percentage };
  }

  @Patch('platform-fee')
  async updatePlatformFee(@Body() dto: UpdatePlatformFeeDto) {
    const updated = await this.contractsService.updatePlatformFeePercentage(
      dto.platformFeePercentage,
    );
    return {
      message: 'Platform fee percentage updated successfully.',
      platformFeePercentage: updated.platformFeePercentage,
    };
  }
}
