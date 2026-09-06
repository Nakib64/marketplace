import { Module } from '@nestjs/common';
import { AdminWithdrawalsController } from './controllers/admin-withdrawals.controller.js';
import { WalletController } from './controllers/wallet.controller.js';
import { WalletService } from './services/wallet.service.js';

@Module({
  controllers: [WalletController, AdminWithdrawalsController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
