import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CreateRefundDto } from '../dto/create-refund.dto.js';
import { WithdrawalQueryDto } from '../dto/withdrawal-query.dto.js';
import { WalletService } from '../services/wallet.service.js';

@Roles(Role.ADMIN)
@Controller('admin')
export class AdminWithdrawalsController {
  constructor(private readonly walletService: WalletService) {}

  @Get('withdrawals')
  async getWithdrawals(@Query() query: WithdrawalQueryDto) {
    return this.walletService.getAdminWithdrawals(query);
  }

  @Patch('withdrawals/:id/approve')
  async approveWithdrawal(@Param('id') id: string) {
    return this.walletService.approveWithdrawal(id);
  }

  @Patch('withdrawals/:id/reject')
  async rejectWithdrawal(@Param('id') id: string) {
    return this.walletService.rejectWithdrawal(id);
  }

  @Post('contracts/:id/refund')
  async refundContract(
    @CurrentUser('id') adminId: string,
    @Param('id') contractId: string,
    @Body() dto: CreateRefundDto,
  ) {
    return this.walletService.refundContract(adminId, contractId, dto);
  }

  @Get('refunds')
  async getRefunds() {
    return this.walletService.getAdminRefunds();
  }
}
