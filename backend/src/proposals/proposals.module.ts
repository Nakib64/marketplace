import { Module } from '@nestjs/common';
import { QueuesModule } from '../queues/queues.module.js';
import { ClientProposalsController } from './controllers/client-proposals.controller.js';
import { ProposalsController } from './controllers/proposals.controller.js';
import { ClientProposalsService } from './services/client-proposals.service.js';
import { ProposalsService } from './services/proposals.service.js';

@Module({
  imports: [QueuesModule],
  controllers: [ProposalsController, ClientProposalsController],
  providers: [ProposalsService, ClientProposalsService],
  exports: [ProposalsService, ClientProposalsService],
})
export class ProposalsModule {}
