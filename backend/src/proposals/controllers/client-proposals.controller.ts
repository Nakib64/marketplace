import { Controller, Get, Param } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { ClientProposalsService } from '../services/client-proposals.service.js';

@Roles(Role.CLIENT)
@Controller('jobs')
export class ClientProposalsController {
  constructor(private readonly clientProposalsService: ClientProposalsService) {}

  @Get(':jobId/proposals')
  async getJobProposals(
    @CurrentUser('id') clientId: string,
    @Param('jobId') jobId: string,
  ) {
    return this.clientProposalsService.getJobProposals(jobId, clientId);
  }
}
