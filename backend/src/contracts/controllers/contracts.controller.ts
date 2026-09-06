import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { AcceptProposalDto } from '../dto/accept-proposal.dto.js';
import { ContractsService } from '../services/contracts.service.js';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Roles(Role.CLIENT)
  @Post('accept-proposal')
  async acceptProposal(
    @CurrentUser('id') clientId: string,
    @Body() dto: AcceptProposalDto,
  ) {
    return this.contractsService.acceptProposal(clientId, dto.proposalId);
  }

  @Roles(Role.FREELANCER)
  @Post(':id/submit-work')
  async submitWork(
    @CurrentUser('id') freelancerId: string,
    @Param('id') contractId: string,
  ) {
    return this.contractsService.submitWork(freelancerId, contractId);
  }

  @Roles(Role.CLIENT)
  @Post(':id/approve-work')
  async approveWork(
    @CurrentUser('id') clientId: string,
    @Param('id') contractId: string,
  ) {
    return this.contractsService.approveWork(clientId, contractId);
  }

  @Post(':id/dispute')
  async disputeContract(
    @CurrentUser('id') userId: string,
    @Param('id') contractId: string,
  ) {
    return this.contractsService.disputeContract(userId, contractId);
  }

  @Get()
  async getUserContracts(@CurrentUser('id') userId: string) {
    return this.contractsService.getUserContracts(userId);
  }

  @Get(':id')
  async getContract(
    @CurrentUser('id') userId: string,
    @Param('id') contractId: string,
  ) {
    return this.contractsService.getContract(userId, contractId);
  }
}
