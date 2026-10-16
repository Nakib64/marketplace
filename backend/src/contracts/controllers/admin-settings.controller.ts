import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { AuditLoggerService } from '../../admin/audit/services/audit-logger.service.js';
import { CircuitBreakerService } from '../../redis/circuit-breaker.service.js';
import { ToggleCircuitBreakerDto } from '../dto/toggle-circuit-breaker.dto.js';
import { UpdatePlatformFeeDto } from '../dto/update-platform-fee.dto.js';
import { ContractsService } from '../services/contracts.service.js';

@Roles(Role.ADMIN)
@Controller('admin/settings')
export class AdminSettingsController {
  constructor(
    private readonly contractsService: ContractsService,
    private readonly auditLogger: AuditLoggerService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {}

  @Get('platform-fee')
  async getPlatformFee() {
    const percentage = await this.contractsService.getPlatformFeePercentage();
    return { platformFeePercentage: percentage };
  }

  @Patch('platform-fee')
  async updatePlatformFee(
    @CurrentUser('id') adminId: string,
    @Body() dto: UpdatePlatformFeeDto,
  ) {
    const updated = await this.contractsService.updatePlatformFeePercentage(
      dto.platformFeePercentage,
    );
    await this.auditLogger.logAction({
      adminId,
      action: 'FEE_UPDATED',
      targetType: 'SETTING',
      details: `Platform fee updated to ${dto.platformFeePercentage}%`,
    });
    return {
      message: 'Platform fee percentage updated successfully.',
      platformFeePercentage: updated.platformFeePercentage,
    };
  }

  @Get('circuit-breakers')
  async getCircuitBreakers() {
    return this.circuitBreaker.getAllFlags();
  }

  @Post('circuit-breakers/toggle')
  async toggleCircuitBreaker(
    @CurrentUser('id') adminId: string,
    @Body() dto: ToggleCircuitBreakerDto,
  ) {
    await this.circuitBreaker.setFlag(dto.type, dto.state);

    await this.auditLogger.logAction({
      adminId,
      action: 'CIRCUIT_BREAKER_TOGGLED',
      targetType: 'SETTING',
      targetId: dto.type,
      details: `Circuit breaker [${dto.type}] set to ${dto.state ? 'ACTIVE (TRIPPED)' : 'INACTIVE (NORMAL)'}. Reason: ${dto.reason || 'None provided'}`,
    });

    return {
      message: `Circuit breaker [${dto.type}] successfully updated.`,
      type: dto.type,
      state: dto.state,
    };
  }
}
