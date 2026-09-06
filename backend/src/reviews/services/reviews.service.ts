import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContractStatus, ReviewStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CounterFeedbackDto } from '../dto/counter-feedback.dto.js';
import { CreateReviewDto } from '../dto/create-review.dto.js';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Submits a review for a completed contract under double-blind rules.
   */
  async submitReview(reviewerId: string, dto: CreateReviewDto) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: dto.contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found.');
    }
    if (contract.status !== ContractStatus.COMPLETED) {
      throw new BadRequestException('Reviews can only be submitted for completed contracts.');
    }

    const isClient = contract.clientId === reviewerId;
    const isFreelancer = contract.freelancerId === reviewerId;

    if (!isClient && !isFreelancer) {
      throw new ForbiddenException('You are not a participant in this contract.');
    }

    const revieweeId = isClient ? contract.freelancerId : contract.clientId;

    const existingReview = await this.prisma.review.findUnique({
      where: {
        contractId_reviewerId: {
          contractId: dto.contractId,
          reviewerId,
        },
      },
    });

    if (existingReview) {
      throw new ConflictException('You have already submitted a review for this contract.');
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Create the new review (default status: HIDDEN)
      const newReview = await tx.review.create({
        data: {
          contractId: dto.contractId,
          reviewerId,
          revieweeId,
          rating: dto.rating,
          feedback: dto.feedback,
          status: ReviewStatus.HIDDEN,
        },
      });

      // 2. Check if counterpart review already exists
      const counterpartReview = await tx.review.findFirst({
        where: {
          contractId: dto.contractId,
          reviewerId: revieweeId,
        },
      });

      // 3. If counterpart review exists, reveal both reviews
      if (counterpartReview) {
        await tx.review.updateMany({
          where: { contractId: dto.contractId },
          data: { status: ReviewStatus.PUBLISHED },
        });

        // Recalculate freelancer successRate
        await this.recalculateFreelancerStats(tx, contract.freelancerId);

        return {
          ...newReview,
          status: ReviewStatus.PUBLISHED,
          message: 'Both reviews have been submitted and published.',
        };
      }

      return {
        ...newReview,
        message: 'Review submitted. It will remain hidden until the counterpart submits their review.',
      };
    });
  }

  /**
   * Recalculates freelancer successRate based on all received PUBLISHED reviews.
   */
  async recalculateFreelancerStats(tx: any, freelancerId: string) {
    const publishedReviews = await tx.review.findMany({
      where: {
        revieweeId: freelancerId,
        status: ReviewStatus.PUBLISHED,
      },
    });

    if (publishedReviews.length === 0) {
      return;
    }

    const avgRating =
      publishedReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) /
      publishedReviews.length;
    const successRate = Number(((avgRating / 5) * 100).toFixed(1));

    await tx.freelancerProfile.update({
      where: { userId: freelancerId },
      data: { successRate },
    });
  }

  /**
   * Adds counter-feedback to a published review (reviewee only).
   */
  async addCounterFeedback(userId: string, reviewId: string, dto: CounterFeedbackDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found.');
    }
    if (review.status !== ReviewStatus.PUBLISHED) {
      throw new BadRequestException('Counter-feedback can only be added to published reviews.');
    }
    if (review.revieweeId !== userId) {
      throw new ForbiddenException('Only the reviewee can add counter-feedback.');
    }
    if (review.counterFeedback) {
      throw new ConflictException('Counter-feedback has already been submitted for this review.');
    }

    return await this.prisma.review.update({
      where: { id: reviewId },
      data: { counterFeedback: dto.counterFeedback },
    });
  }

  /**
   * Retrieves public published reviews for a given user.
   */
  async getUserReviews(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        revieweeId: userId,
        status: ReviewStatus.PUBLISHED,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number(
            (
              reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
            ).toFixed(1),
          )
        : 0;

    return {
      totalReviews,
      averageRating,
      reviews,
    };
  }

  /**
   * Inspects reviews for a contract by an authorized participant.
   */
  async getContractReviews(userId: string, contractId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found.');
    }
    if (contract.clientId !== userId && contract.freelancerId !== userId) {
      throw new ForbiddenException('You are not a participant in this contract.');
    }

    const reviews = await this.prisma.review.findMany({
      where: { contractId },
    });

    // If reviews are not yet published, only show the user's own review
    return reviews.filter(
      (r) => r.status === ReviewStatus.PUBLISHED || r.reviewerId === userId,
    );
  }
}
