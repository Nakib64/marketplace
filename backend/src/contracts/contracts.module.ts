import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module.js';
import { AdminSettingsController } from './controllers/admin-settings.controller.js';
import { ContractsController } from './controllers/contracts.controller.js';
import { PaymentsController } from './controllers/payments.controller.js';
import { ContractsService } from './services/contracts.service.js';
import { SslCommerzService } from './services/sslcommerz.service.js';

@Module({
  imports: [AdminModule],
  controllers: [ContractsController, AdminSettingsController, PaymentsController],
  providers: [ContractsService, SslCommerzService],
  exports: [ContractsService, SslCommerzService],
})
export class ContractsModule {}

