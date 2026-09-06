import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Public } from '../../auth/decorators/public.decorator.js';
import { CounterFeedbackDto } from '../dto/counter-feedback.dto.js';
import { CreateReviewDto } from '../dto/create-review.dto.js';
import { ReviewsService } from '../services/reviews.service.js';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async submitReview(
    @CurrentUser('id') reviewerId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.submitReview(reviewerId, dto);
  }

  @Post(':id/counter-feedback')
  async addCounterFeedback(
    @CurrentUser('id') userId: string,
    @Param('id') reviewId: string,
    @Body() dto: CounterFeedbackDto,
  ) {
    return this.reviewsService.addCounterFeedback(userId, reviewId, dto);
  }

  @Public()
  @Get('user/:userId')
  async getUserReviews(@Param('userId') userId: string) {
    return this.reviewsService.getUserReviews(userId);
  }

  @Get('contract/:contractId')
  async getContractReviews(
    @CurrentUser('id') userId: string,
    @Param('contractId') contractId: string,
  ) {
    return this.reviewsService.getContractReviews(userId, contractId);
  }
}
