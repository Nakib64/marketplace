import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator.js';
import { SearchJobsDto } from '../dto/search-jobs.dto.js';
import { JobsSearchService } from '../services/jobs-search.service.js';

@Public()
@Controller('jobs')
export class JobsSearchController {
  constructor(private readonly jobsSearchService: JobsSearchService) {}

  @Get()
  async searchJobs(@Query() query: SearchJobsDto) {
    return this.jobsSearchService.searchJobs(query);
  }

  @Get(':id')
  async getJobDetails(@Param('id') jobId: string) {
    return this.jobsSearchService.getJobDetails(jobId);
  }
}
