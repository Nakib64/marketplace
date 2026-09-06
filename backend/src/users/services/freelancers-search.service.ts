import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface FreelancerSearchQuery {
  skills?: string[];
  minRate?: number;
  maxRate?: number;
  page?: number;
  limit?: number;
}

@Injectable()
export class FreelancersSearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchFreelancers(query: FreelancerSearchQuery) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = {
      ...(query.skills && query.skills.length > 0
        ? { skills: { hasSome: query.skills } }
        : {}),
      ...(query.minRate || query.maxRate
        ? {
            hourlyRate: {
              ...(query.minRate ? { gte: query.minRate } : {}),
              ...(query.maxRate ? { lte: query.maxRate } : {}),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.freelancerProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { successRate: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, createdAt: true },
          },
          portfolioItems: {
            take: 2,
            include: { images: { take: 1 } },
          },
        },
      }),
      this.prisma.freelancerProfile.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPublicFreelancerProfile(freelancerProfileId: string) {
    const profile = await this.prisma.freelancerProfile.findUnique({
      where: { id: freelancerProfileId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
            workHistories: { orderBy: { startDate: 'desc' } },
          },
        },
        portfolioItems: {
          include: { images: { orderBy: { order: 'asc' } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Freelancer profile not found.');
    }

    return profile;
  }
}
