import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../../auth/decorators/roles.decorator.js';
import { AdminJobQueryDto } from '../dto/admin-job-query.dto.js';
import { AdminUpdateJobDto } from '../dto/admin-update-job.dto.js';
import { AdminUpdateProposalDto } from '../dto/admin-update-proposal.dto.js';
import { AdminJobsService } from '../services/admin-jobs.service.js';

@Roles(Role.ADMIN)
@Controller('admin')
export class AdminJobsController {
  constructor(private readonly adminJobsService: AdminJobsService) {}

  @Get('jobs')
  async getAllJobs(@Query() query: AdminJobQueryDto) {
    return this.adminJobsService.getAllJobs(query);
  }

  @Get('jobs/:id')
  async getJobDetails(@Param('id') id: string) {
    return this.adminJobsService.getJobDetails(id);
  }

  @Patch('jobs/:id')
  async updateJob(
    @CurrentUser('id') adminId: string,
    @Param('id') id: string,
    @Body() dto: AdminUpdateJobDto,
  ) {
    return this.adminJobsService.updateJob(adminId, id, dto);
  }

  @Delete('jobs/:id')
  async cancelJob(
    @CurrentUser('id') adminId: string,
    @Param('id') id: string,
    @Query('reason') reason?: string,
  ) {
    return this.adminJobsService.cancelJob(adminId, id, reason);
  }

  @Get('jobs/:id/proposals')
  async getJobProposals(
    @Param('id') jobId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminJobsService.getJobProposals(jobId, page ? Number(page) : 1, limit ? Number(limit) : 20);
  }

  @Get('proposals/:id')
  async getProposalDetails(@Param('id') proposalId: string) {
    return this.adminJobsService.getProposalDetails(proposalId);
  }

  @Patch('proposals/:id/status')
  async updateProposalStatus(
    @CurrentUser('id') adminId: string,
    @Param('id') proposalId: string,
    @Body() dto: AdminUpdateProposalDto,
  ) {
    return this.adminJobsService.updateProposalStatus(adminId, proposalId, dto);
  }
}
