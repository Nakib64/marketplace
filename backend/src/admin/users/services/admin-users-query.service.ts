import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { UserQueryDto } from '../dto/user-query.dto.js';

@Injectable()
export class AdminUsersQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(query: UserQueryDto) {
    const { role, isBanned, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(role ? { role } : {}),
      ...(isBanned !== undefined ? { isBanned } : {}),
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { id: { contains: search } },
            ],
          }
        : {}),
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
          isBanned: true,
          isEmailVerified: true,
          walletBalance: true,
          createdAt: true,
          clientProfile: { select: { companyName: true, totalSpent: true, rating: true } },
          freelancerProfile: { select: { title: true, earnings: true, rating: true, successRate: true } },
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

  async getUserDossier(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        clientProfile: true,
        freelancerProfile: { include: { portfolioItems: true } },
        givenReviews: { take: 5, orderBy: { createdAt: 'desc' } },
        receivedReviews: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found.');
    }

    const { passwordHash, ...userDossier } = user;
    return userDossier;
  }
}
