import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserQueryDto } from '../dto/user-query.dto.js';

@Injectable()
export class AdminUsersQueryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Search and filter user directory with aggregated financials.
   */
  async getUsers(query: UserQueryDto) {
    const { role, isBanned, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(role ? { role } : {}),
      ...(isBanned !== undefined ? { isBanned } : {}),
      ...(search ? { email: { contains: search, mode: 'insensitive' } } : {}),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          role: true,
          isEmailVerified: true,
          isBanned: true,
          walletBalance: true,
          createdAt: true,
          clientProfile: {
            select: { companyName: true, totalSpent: true, totalJobPosts: true },
          },
          freelancerProfile: {
            select: { hourlyRate: true, earnings: true, totalProjects: true, successRate: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retrieves complete user dossier with jobs, contracts, withdrawals, and reviews.
   */
  async getUserDossier(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        clientProfile: true,
        freelancerProfile: true,
        postedJobs: { take: 5, orderBy: { createdAt: 'desc' } },
        clientContracts: { take: 5, orderBy: { createdAt: 'desc' } },
        freelancerContracts: { take: 5, orderBy: { createdAt: 'desc' } },
        withdrawals: { take: 5, orderBy: { createdAt: 'desc' } },
        receivedReviews: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
