import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ContractStatus, ReviewStatus } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReviewsService } from './services/reviews.service.js';

describe('ReviewsService', () => {
  let reviewsService: ReviewsService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      contract: {
        findUnique: vi.fn(),
      },
      review: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      freelancerProfile: {
        update: vi.fn(),
      },
      clientProfile: {
        update: vi.fn(),
      },
      $transaction: vi.fn((cb) => cb(prismaMock)),
    };

    reviewsService = new ReviewsService(prismaMock);
  });

  describe('submitReview', () => {
    it('should throw NotFoundException if contract does not exist', async () => {
      prismaMock.contract.findUnique.mockResolvedValue(null);

      await expect(
        reviewsService.submitReview('client-1', {
          contractId: 'contract-1',
          rating: 5,
          feedback: 'Excellent work and timely delivery!',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if contract is not COMPLETED', async () => {
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'contract-1',
        status: ContractStatus.FUNDED,
        clientId: 'client-1',
        freelancerId: 'free-1',
      });

      await expect(
        reviewsService.submitReview('client-1', {
          contractId: 'contract-1',
          rating: 5,
          feedback: 'Great job done!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if reviewer is not a participant in the contract', async () => {
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'contract-1',
        status: ContractStatus.COMPLETED,
        clientId: 'client-1',
        freelancerId: 'free-1',
      });

      await expect(
        reviewsService.submitReview('random-user', {
          contractId: 'contract-1',
          rating: 5,
          feedback: 'Great job done!',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ConflictException if reviewer has already submitted a review', async () => {
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'contract-1',
        status: ContractStatus.COMPLETED,
        clientId: 'client-1',
        freelancerId: 'free-1',
      });
      prismaMock.review.findUnique.mockResolvedValue({
        id: 'rev-1',
        contractId: 'contract-1',
        reviewerId: 'client-1',
      });

      await expect(
        reviewsService.submitReview('client-1', {
          contractId: 'contract-1',
          rating: 5,
          feedback: 'Great job done!',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create review with HIDDEN status when counterpart has not submitted yet', async () => {
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'contract-1',
        status: ContractStatus.COMPLETED,
        clientId: 'client-1',
        freelancerId: 'free-1',
      });
      prismaMock.review.findUnique.mockResolvedValue(null);
      prismaMock.review.create.mockResolvedValue({
        id: 'rev-1',
        contractId: 'contract-1',
        reviewerId: 'client-1',
        revieweeId: 'free-1',
        rating: 5,
        feedback: 'Superb collaboration.',
        status: ReviewStatus.HIDDEN,
      });
      prismaMock.review.findFirst.mockResolvedValue(null); // counterpart hasn't reviewed yet

      const res = await reviewsService.submitReview('client-1', {
        contractId: 'contract-1',
        rating: 5,
        feedback: 'Superb collaboration.',
      });

      expect(res.status).toBe(ReviewStatus.HIDDEN);
      expect(prismaMock.review.updateMany).not.toHaveBeenCalled();
    });

    it('should reveal both reviews to PUBLISHED and recompute successRate when counterpart review exists', async () => {
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'contract-1',
        status: ContractStatus.COMPLETED,
        clientId: 'client-1',
        freelancerId: 'free-1',
      });
      prismaMock.review.findUnique.mockResolvedValue(null);
      prismaMock.review.create.mockResolvedValue({
        id: 'rev-2',
        contractId: 'contract-1',
        reviewerId: 'free-1',
        revieweeId: 'client-1',
        rating: 5,
        feedback: 'Prompt payment and great communication.',
        status: ReviewStatus.HIDDEN,
      });
      // Counterpart review (client's review) already exists
      prismaMock.review.findFirst.mockResolvedValue({
        id: 'rev-1',
        contractId: 'contract-1',
        reviewerId: 'client-1',
        revieweeId: 'free-1',
      });

      // Reviews for freelancer stats calculation
      prismaMock.review.findMany.mockResolvedValue([
        { rating: 5, status: ReviewStatus.PUBLISHED },
        { rating: 4, status: ReviewStatus.PUBLISHED },
      ]);

      const res = await reviewsService.submitReview('free-1', {
        contractId: 'contract-1',
        rating: 5,
        feedback: 'Prompt payment and great communication.',
      });

      expect(res.status).toBe(ReviewStatus.PUBLISHED);
      expect(prismaMock.review.updateMany).toHaveBeenCalledWith({
        where: { contractId: 'contract-1' },
        data: { status: ReviewStatus.PUBLISHED },
      });
      // avg rating = (5 + 4) / 2 = 4.5 -> successRate = (4.5 / 5) * 100 = 90.0
      expect(prismaMock.freelancerProfile.update).toHaveBeenCalledWith({
        where: { userId: 'free-1' },
        data: { rating: 4.5, totalReviews: 2, successRate: 90.0 },
      });
      expect(prismaMock.clientProfile.update).toHaveBeenCalledWith({
        where: { userId: 'client-1' },
        data: { rating: 4.5, totalReviews: 2 },
      });
    });
  });

  describe('addCounterFeedback', () => {
    it('should throw BadRequestException if review is HIDDEN', async () => {
      prismaMock.review.findUnique.mockResolvedValue({
        id: 'rev-1',
        revieweeId: 'free-1',
        status: ReviewStatus.HIDDEN,
      });

      await expect(
        reviewsService.addCounterFeedback('free-1', 'rev-1', {
          counterFeedback: 'Thank you for your feedback!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if caller is not the reviewee', async () => {
      prismaMock.review.findUnique.mockResolvedValue({
        id: 'rev-1',
        revieweeId: 'free-1',
        status: ReviewStatus.PUBLISHED,
      });

      await expect(
        reviewsService.addCounterFeedback('other-user', 'rev-1', {
          counterFeedback: 'Thank you for your feedback!',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ConflictException if counter-feedback has already been posted', async () => {
      prismaMock.review.findUnique.mockResolvedValue({
        id: 'rev-1',
        revieweeId: 'free-1',
        status: ReviewStatus.PUBLISHED,
        counterFeedback: 'Previous response',
      });

      await expect(
        reviewsService.addCounterFeedback('free-1', 'rev-1', {
          counterFeedback: 'New response',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should update counter-feedback successfully', async () => {
      prismaMock.review.findUnique.mockResolvedValue({
        id: 'rev-1',
        revieweeId: 'free-1',
        status: ReviewStatus.PUBLISHED,
        counterFeedback: null,
      });
      prismaMock.review.update.mockResolvedValue({
        id: 'rev-1',
        counterFeedback: 'Thank you so much!',
      });

      const res = await reviewsService.addCounterFeedback('free-1', 'rev-1', {
        counterFeedback: 'Thank you so much!',
      });

      expect(res.counterFeedback).toBe('Thank you so much!');
    });
  });

  describe('getUserReviews', () => {
    it('should calculate averageRating and totalReviews accurately', async () => {
      prismaMock.review.findMany.mockResolvedValue([
        { id: '1', rating: 5, feedback: 'Great', status: ReviewStatus.PUBLISHED },
        { id: '2', rating: 3, feedback: 'Okay', status: ReviewStatus.PUBLISHED },
      ]);

      const res = await reviewsService.getUserReviews('user-1');

      expect(res.totalReviews).toBe(2);
      expect(res.averageRating).toBe(4.0);
    });
  });
});
