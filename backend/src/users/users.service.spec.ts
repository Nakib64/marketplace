import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FreelancersSearchService } from './services/freelancers-search.service.js';
import { PortfolioService } from './services/portfolio.service.js';
import { UsersService } from './services/users.service.js';
import { WorkHistoryService } from './services/work-history.service.js';

describe('Users Sub-Services', () => {
  let usersService: UsersService;
  let workHistoryService: WorkHistoryService;
  let portfolioService: PortfolioService;
  let freelancersSearchService: FreelancersSearchService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: vi.fn(),
      },
      clientProfile: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      freelancerProfile: {
        findUnique: vi.fn(),
        update: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
      },
      workHistory: {
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      portfolioItem: {
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      portfolioImage: {
        deleteMany: vi.fn(),
        createMany: vi.fn(),
      },
      $transaction: vi.fn(async (cb) => cb(prismaMock)),
    };

    usersService = new UsersService(prismaMock);
    workHistoryService = new WorkHistoryService(prismaMock);
    portfolioService = new PortfolioService(prismaMock);
    freelancersSearchService = new FreelancersSearchService(prismaMock);
  });

  describe('UsersService', () => {
    it('should return full user profile if user exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'test@example.com',
        role: 'FREELANCER',
        freelancerProfile: { bio: 'Web Dev' },
        workHistories: [],
      });

      const profile = await usersService.getUserProfile('user-123');
      expect(profile.id).toBe('user-123');
      expect(profile.email).toBe('test@example.com');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(usersService.getUserProfile('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('WorkHistoryService', () => {
    it('should add work history entry', async () => {
      prismaMock.workHistory.create.mockResolvedValue({
        id: 'work-1',
        title: 'Full Stack Engineer',
        company: 'Acme Inc',
      });

      const result = await workHistoryService.addWorkHistory('user-123', {
        title: 'Full Stack Engineer',
        company: 'Acme Inc',
        startDate: '2023-01-01',
      });

      expect(result.title).toBe('Full Stack Engineer');
      expect(prismaMock.workHistory.create).toHaveBeenCalled();
    });

    it('should prevent unauthorized work history deletion', async () => {
      prismaMock.workHistory.findUnique.mockResolvedValue({
        id: 'work-1',
        userId: 'other-user',
      });

      await expect(
        workHistoryService.deleteWorkHistory('user-123', 'work-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('PortfolioService', () => {
    it('should create portfolio item with images and subtitles', async () => {
      prismaMock.freelancerProfile.findUnique.mockResolvedValue({
        id: 'freelancer-prof-1',
        userId: 'user-123',
      });

      prismaMock.portfolioItem.create.mockResolvedValue({
        id: 'portfolio-1',
        title: 'E-commerce Redesign',
        details: 'Full React & Node implementation',
        liveLink: 'https://example.com',
        images: [
          { imageUrl: 'https://img.com/1.png', subtitle: 'Homepage View', order: 0 },
        ],
      });

      const result = await portfolioService.addPortfolioItem('user-123', {
        title: 'E-commerce Redesign',
        details: 'Full React & Node implementation',
        liveLink: 'https://example.com',
        images: [
          { imageUrl: 'https://img.com/1.png', subtitle: 'Homepage View' },
        ],
      });

      expect(result.title).toBe('E-commerce Redesign');
      expect(prismaMock.portfolioItem.create).toHaveBeenCalled();
    });

    it('should reject portfolio item creation if more than 7 images provided', async () => {
      prismaMock.freelancerProfile.findUnique.mockResolvedValue({
        id: 'freelancer-prof-1',
        userId: 'user-123',
      });

      const eightImages = Array(8).fill({ imageUrl: 'https://img.com/pic.png' });

      await expect(
        portfolioService.addPortfolioItem('user-123', {
          title: 'Too Many Images',
          details: 'Detailed description of project',
          images: eightImages,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('FreelancersSearchService', () => {
    it('should return paginated freelancer results', async () => {
      prismaMock.freelancerProfile.findMany.mockResolvedValue([
        { id: 'f1', hourlyRate: 50, skills: ['React'] },
      ]);
      prismaMock.freelancerProfile.count.mockResolvedValue(1);

      const result = await freelancersSearchService.searchFreelancers({
        skills: ['React'],
        page: 1,
        limit: 10,
      });

      expect(result.data.length).toBe(1);
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
    });
  });
});
