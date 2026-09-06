import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RequireEmailVerified } from '../../auth/decorators/require-email-verified.decorator.js';
import { CreateProposalDto } from '../dto/create-proposal.dto.js';
import { UpdateProposalDto } from '../dto/update-proposal.dto.js';
import { ProposalsService } from '../services/proposals.service.js';

@Roles(Role.FREELANCER)
@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @RequireEmailVerified()
  @Post('job/:jobId')
  @HttpCode(HttpStatus.CREATED)
  async submitProposal(
    @CurrentUser('id') freelancerId: string,
    @Param('jobId') jobId: string,
    @Body() dto: CreateProposalDto,
  ) {
    return this.proposalsService.submitProposal(jobId, freelancerId, dto);
  }

  @Get('my-proposals')
  async getMyProposals(@CurrentUser('id') freelancerId: string) {
    return this.proposalsService.getFreelancerProposals(freelancerId);
  }

  @Patch(':id')
  async updateProposal(
    @CurrentUser('id') freelancerId: string,
    @Param('id') proposalId: string,
    @Body() dto: UpdateProposalDto,
  ) {
    return this.proposalsService.updateProposal(proposalId, freelancerId, dto);
  }

  @Delete(':id')
  async withdrawProposal(
    @CurrentUser('id') freelancerId: string,
    @Param('id') proposalId: string,
  ) {
    return this.proposalsService.withdrawProposal(proposalId, freelancerId);
  }
}
