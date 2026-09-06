import { Body, Controller, Get, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RequireEmailVerified } from '../../auth/decorators/require-email-verified.decorator.js';
import { RequestWithdrawalDto } from '../dto/request-withdrawal.dto.js';
import { WalletService } from '../services/wallet.service.js';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  async getWalletBalance(@CurrentUser('id') userId: string) {
    return this.walletService.getWalletBalance(userId);
  }

  @Roles(Role.FREELANCER)
  @RequireEmailVerified()
  @Post('withdraw')
  async requestWithdrawal(
    @CurrentUser('id') freelancerId: string,
    @Body() dto: RequestWithdrawalDto,
  ) {
    return this.walletService.requestWithdrawal(freelancerId, dto);
  }
}
