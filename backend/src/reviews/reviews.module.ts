import { Module } from '@nestjs/common';
import { ReviewsController } from './controllers/reviews.controller.js';
import { ReviewsService } from './services/reviews.service.js';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
