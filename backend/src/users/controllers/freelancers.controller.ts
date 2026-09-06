import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator.js';
import { FreelancersSearchService } from '../services/freelancers-search.service.js';

@Public()
@Controller('users/freelancers')
export class FreelancersController {
  constructor(private readonly freelancersSearchService: FreelancersSearchService) {}

  @Get()
  async searchFreelancers(
    @Query('skills') skills?: string | string[],
    @Query('minRate') minRate?: string,
    @Query('maxRate') maxRate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const skillsArray = skills
      ? Array.isArray(skills)
        ? skills
        : skills.split(',')
      : undefined;

    return this.freelancersSearchService.searchFreelancers({
      skills: skillsArray,
      minRate: minRate ? Number(minRate) : undefined,
      maxRate: maxRate ? Number(maxRate) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  async getPublicFreelancerProfile(@Param('id') freelancerProfileId: string) {
    return this.freelancersSearchService.getPublicFreelancerProfile(freelancerProfileId);
  }
}
