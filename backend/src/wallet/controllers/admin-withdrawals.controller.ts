import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { AuditLoggerService } from '../../admin/audit/services/audit-logger.service.js';
import { CreateRefundDto } from '../dto/create-refund.dto.js';
import { WithdrawalQueryDto } from '../dto/withdrawal-query.dto.js';
import { WalletService } from '../services/wallet.service.js';

@Roles(Role.ADMIN)
@Controller('admin')
export class AdminWithdrawalsController {
  constructor(
    private readonly walletService: WalletService,
    private readonly auditLogger: AuditLoggerService,
  ) {}

  @Get('withdrawals')
  async getWithdrawals(@Query() query: WithdrawalQueryDto) {
    return this.walletService.getAdminWithdrawals(query);
  }

  @Patch('withdrawals/:id/approve')
  async approveWithdrawal(
    @CurrentUser('id') adminId: string,
    @Param('id') id: string,
  ) {
    const result = await this.walletService.approveWithdrawal(id);
    await this.auditLogger.logAction({
      adminId,
      action: 'PAYOUT_APPROVED',
      targetType: 'WITHDRAWAL',
      targetId: id,
    });
    return result;
  }

  @Patch('withdrawals/:id/reject')
  async rejectWithdrawal(
    @CurrentUser('id') adminId: string,
    @Param('id') id: string,
  ) {
    const result = await this.walletService.rejectWithdrawal(id);
    await this.auditLogger.logAction({
      adminId,
      action: 'PAYOUT_REJECTED',
      targetType: 'WITHDRAWAL',
      targetId: id,
    });
    return result;
  }

  @Post('contracts/:id/refund')
  async refundContract(
    @CurrentUser('id') adminId: string,
    @Param('id') contractId: string,
    @Body() dto: CreateRefundDto,
  ) {
    const result = await this.walletService.refundContract(adminId, contractId, dto);
    await this.auditLogger.logAction({
      adminId,
      action: 'ESCROW_REFUNDED',
      targetType: 'CONTRACT',
      targetId: contractId,
      details: dto.reason,
    });
    return result;
  }

  @Get('refunds')
  async getRefunds() {
    return this.walletService.getAdminRefunds();
  }
}

