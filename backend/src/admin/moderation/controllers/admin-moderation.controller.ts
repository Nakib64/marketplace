import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../../auth/decorators/roles.decorator.js';
import { DeleteReviewDto } from '../dto/delete-review.dto.js';
import { ModerateJobDto } from '../dto/moderate-job.dto.js';
import { ModerationQueryDto } from '../dto/moderation-query.dto.js';
import { AdminModerationService } from '../services/admin-moderation.service.js';

@Roles(Role.ADMIN)
@Controller('admin/moderation')
export class AdminModerationController {
  constructor(private readonly moderationService: AdminModerationService) {}

  @Get('jobs')
  async getFlaggedJobs(@Query() query: ModerationQueryDto) {
    return this.moderationService.getFlaggedJobs(query);
  }

  @Patch('jobs/:id/action')
  async moderateJob(
    @CurrentUser('id') adminId: string,
    @Param('id') jobId: string,
    @Body() dto: ModerateJobDto,
  ) {
    return this.moderationService.moderateJob(adminId, jobId, dto);
  }

  @Get('reviews')
  async getFlaggedReviews(@Query() query: ModerationQueryDto) {
    return this.moderationService.getFlaggedReviews(query);
  }

  @Delete('reviews/:id')
  async deleteReview(
    @CurrentUser('id') adminId: string,
    @Param('id') reviewId: string,
    @Body() dto: DeleteReviewDto,
  ) {
    return this.moderationService.deleteReview(adminId, reviewId, dto);
  }

  @Get('reports')
  async getJobReports(@Query() query: ModerationQueryDto) {
    return this.moderationService.getJobReports(query);
  }
}
