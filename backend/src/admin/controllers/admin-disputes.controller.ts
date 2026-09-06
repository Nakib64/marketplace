import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { DisputeResolutionDto } from '../dto/dispute-resolution.dto.js';
import { DisputeSplitDto } from '../dto/dispute-split.dto.js';
import { AdminDisputesQueryService } from '../services/admin-disputes-query.service.js';
import { AdminDisputesVerdictsService } from '../services/admin-disputes-verdicts.service.js';

@Roles(Role.ADMIN)
@Controller('admin/disputes')
export class AdminDisputesController {
  constructor(
    private readonly queryService: AdminDisputesQueryService,
    private readonly verdictsService: AdminDisputesVerdictsService,
  ) {}

  @Get()
  async getDisputes() {
    return this.queryService.getDisputes();
  }

  @Get(':id')
  async getDisputeDossier(@Param('id') id: string) {
    return this.queryService.getDisputeDossier(id);
  }

  @Post(':id/refund')
  async forceRefundToClient(
    @CurrentUser('id') adminId: string,
    @Param('id') id: string,
    @Body() dto: DisputeResolutionDto,
  ) {
    return this.verdictsService.forceRefundToClient(adminId, id, dto);
  }

  @Post(':id/release')
  async forceReleaseToFreelancer(
    @CurrentUser('id') adminId: string,
    @Param('id') id: string,
    @Body() dto: DisputeResolutionDto,
  ) {
    return this.verdictsService.forceReleaseToFreelancer(adminId, id, dto);
  }

  @Post(':id/split')
  async resolveSplitSettlement(
    @CurrentUser('id') adminId: string,
    @Param('id') id: string,
    @Body() dto: DisputeSplitDto,
  ) {
    return this.verdictsService.resolveSplitSettlement(adminId, id, dto);
  }
}
