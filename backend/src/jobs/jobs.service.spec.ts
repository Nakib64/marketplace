import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { JobStatus } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JobSortBy, SortOrder } from './dto/search-jobs.dto.js';
import { JobsSearchService } from './services/jobs-search.service.js';
import { JobsService } from './services/jobs.service.js';

describe('Jobs Sub-Services', () => {
  let jobsService: JobsService;
  let jobsSearchService: JobsSearchService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      clientProfile: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      job: {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
      },
      $transaction: vi.fn(async (cb) => cb(prismaMock)),
    };

    jobsService = new JobsService(prismaMock);
    jobsSearchService = new JobsSearchService(prismaMock);
  });

  describe('JobsService', () => {
    it('should create a job with category & subCategory and increment client totalJobPosts', async () => {
      prismaMock.clientProfile.findUnique.mockResolvedValue({ id: 'cp-1', userId: 'client-1' });
      prismaMock.job.create.mockResolvedValue({
        id: 'job-1',
        title: 'Full Stack App',
        categoryName: 'Web Development',
        subCategoryName: 'Frontend Development',
        status: JobStatus.OPEN,
      });

      const result = await jobsService.createJob('client-1', {
        title: 'Full Stack App',
        description: 'Detailed job requirement description',
        category: 'Web Development',
        subCategory: 'Frontend Development',
        budget: 1500,
        skills: ['NestJS', 'React'],
      });

      expect(result.id).toBe('job-1');
      expect(result.categoryName).toBe('Web Development');
      expect(prismaMock.clientProfile.update).toHaveBeenCalledWith({
        where: { userId: 'client-1' },
        data: { totalJobPosts: { increment: 1 } },
      });
    });

    it('should throw NotFoundException if client profile does not exist', async () => {
      prismaMock.clientProfile.findUnique.mockResolvedValue(null);

      await expect(
        jobsService.createJob('invalid-client', {
          title: 'Full Stack App',
          description: 'Detailed description requirement',
          category: 'Web Development',
          budget: 1000,
          skills: ['Node'],
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('JobsSearchService (Category & Advanced Filters)', () => {
    it('should search jobs by category and subCategory', async () => {
      prismaMock.job.findMany.mockResolvedValue([
        { id: 'job-1', title: 'NestJS Developer', categoryName: 'Web Development', subCategoryName: 'Backend' },
      ]);
      prismaMock.job.count.mockResolvedValue(1);

      const result = await jobsSearchService.searchJobs({
        category: 'Web Development',
        subCategory: 'Backend',
        minBudget: 1000,
        page: 1,
        limit: 10,
      });

      expect(result.data.length).toBe(1);
      expect(result.filters.category).toBe('Web Development');
      expect(result.filters.subCategory).toBe('Backend');
    });
  });
});
