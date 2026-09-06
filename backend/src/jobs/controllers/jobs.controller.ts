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
import { CreateJobDto } from '../dto/create-job.dto.js';
import { ReportJobDto } from '../dto/report-job.dto.js';
import { UpdateJobDto } from '../dto/update-job.dto.js';
import { JobsService } from '../services/jobs.service.js';

@Roles(Role.CLIENT)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @RequireEmailVerified()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createJob(
    @CurrentUser('id') clientId: string,
    @Body() dto: CreateJobDto,
  ) {
    return this.jobsService.createJob(clientId, dto);
  }

  @Get('my-jobs')
  async getMyJobs(@CurrentUser('id') clientId: string) {
    return this.jobsService.getClientJobs(clientId);
  }

  @Patch(':id')
  async updateJob(
    @CurrentUser('id') clientId: string,
    @Param('id') jobId: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobsService.updateJob(clientId, jobId, dto);
  }

  @Delete(':id')
  async cancelJob(
    @CurrentUser('id') clientId: string,
    @Param('id') jobId: string,
  ) {
    return this.jobsService.cancelJob(clientId, jobId);
  }

  @Roles(Role.CLIENT, Role.FREELANCER, Role.ADMIN)
  @Post(':id/report')
  async reportJob(
    @CurrentUser('id') userId: string,
    @Param('id') jobId: string,
    @Body() dto: ReportJobDto,
  ) {
    return this.jobsService.reportJob(userId, jobId, dto);
  }
}
