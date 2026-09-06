import { Injectable, NotFoundException } from '@nestjs/common';
import { JobStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { JobSortBy, SearchJobsDto, SortOrder } from '../dto/search-jobs.dto.js';

@Injectable()
export class JobsSearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchJobs(query: SearchJobsDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;

    // 1. Calculate Date Filters
    let dateFilter: Prisma.DateTimeFilter | undefined;
    if (query.postedWithin) {
      const now = new Date();
      if (query.postedWithin === '24h') {
        dateFilter = { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
      } else if (query.postedWithin === '7d') {
        dateFilter = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
      } else if (query.postedWithin === '30d') {
        dateFilter = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
      }
    } else if (query.startDate || query.endDate) {
      dateFilter = {
        ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
        ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
      };
    }

    // 2. Build Prisma Where Clause
    const where: Prisma.JobWhereInput = {
      ...(query.status ? { status: query.status } : { status: JobStatus.OPEN }),
      isFlagged: false,
      ...(query.clientId ? { clientId: query.clientId } : {}),
      ...(query.category
        ? {
            OR: [
              { categoryName: { equals: query.category, mode: 'insensitive' } },
              { category: { is: { name: { equals: query.category, mode: 'insensitive' } } } },
            ],
          }
        : {}),
      ...(query.subCategory
        ? {
            OR: [
              { subCategoryName: { equals: query.subCategory, mode: 'insensitive' } },
              { subCategory: { is: { name: { equals: query.subCategory, mode: 'insensitive' } } } },
            ],
          }
        : {}),
      ...(dateFilter ? { createdAt: dateFilter } : {}),
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: 'insensitive' } },
              { description: { contains: query.q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.allSkills && query.allSkills.length > 0
        ? { skills: { hasEvery: query.allSkills } }
        : query.skills && query.skills.length > 0
          ? { skills: { hasSome: query.skills } }
          : {}),
      ...(query.minBudget || query.maxBudget
        ? {
            budget: {
              ...(query.minBudget ? { gte: query.minBudget } : {}),
              ...(query.maxBudget ? { lte: query.maxBudget } : {}),
            },
          }
        : {}),
    };

    // 3. Dynamic Sorting
    const sortByField = query.sortBy || JobSortBy.CREATED_AT;
    const sortDirection = query.sortOrder || SortOrder.DESC;
    const orderBy: Prisma.JobOrderByWithRelationInput = {
      [sortByField]: sortDirection,
    };

    // 4. Query Execution
    const [data, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
          subCategory: true,
          client: {
            select: {
              id: true,
              email: true,
              clientProfile: {
                select: { companyName: true, totalJobPosts: true, totalSpent: true },
              },
            },
          },
          _count: { select: { proposals: true } },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        q: query.q,
        category: query.category,
        subCategory: query.subCategory,
        skills: query.skills || query.allSkills,
        minBudget: query.minBudget,
        maxBudget: query.maxBudget,
        status: query.status || JobStatus.OPEN,
        sortBy: sortByField,
        sortOrder: sortDirection,
      },
    };
  }

  async getJobDetails(jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        category: true,
        subCategory: true,
        client: {
          select: {
            id: true,
            email: true,
            createdAt: true,
            clientProfile: true,
          },
        },
        _count: { select: { proposals: true } },
      },
    });

    if (!job) {
      throw new NotFoundException('Job posting not found.');
    }

    return job;
  }
}
