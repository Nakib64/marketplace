import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module.js';
import { AdminWithdrawalsController } from './controllers/admin-withdrawals.controller.js';
import { WalletController } from './controllers/wallet.controller.js';
import { WalletService } from './services/wallet.service.js';

@Module({
  imports: [AdminModule],
  controllers: [WalletController, AdminWithdrawalsController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}

