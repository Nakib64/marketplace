import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import type { Request } from 'express';
import { Public } from '../../auth/decorators/public.decorator.js';
import { SearchJobsDto } from '../dto/search-jobs.dto.js';
import { JobsSearchService } from '../services/jobs-search.service.js';

@Public()
@Controller('jobs')
export class JobsSearchController {
  constructor(
    private readonly jobsSearchService: JobsSearchService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  async searchJobs(@Query() query: SearchJobsDto, @Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      try {
        const payload: any = this.jwtService.decode(token);
        if (payload && payload.role === Role.CLIENT) {
          throw new ForbiddenException(
            'Clients cannot browse or search open job postings. Please access your posted jobs in your client dashboard.',
          );
        }
      } catch (err) {
        if (err instanceof ForbiddenException) throw err;
      }
    }

    return this.jobsSearchService.searchJobs(query);
  }

  @Get(':id')
  async getJobDetails(@Param('id') jobId: string) {
    return this.jobsSearchService.getJobDetails(jobId);
  }
}
