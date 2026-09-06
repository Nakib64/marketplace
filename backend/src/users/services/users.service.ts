import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateClientProfileDto } from '../dto/update-client-profile.dto.js';
import { UpdateFreelancerProfileDto } from '../dto/update-freelancer-profile.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true,
        walletBalance: true,
        createdAt: true,
        updatedAt: true,
        clientProfile: true,
        freelancerProfile: {
          include: {
            portfolioItems: {
              include: {
                images: { orderBy: { order: 'asc' } },
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
        workHistories: {
          orderBy: { startDate: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found.');
    }

    return user;
  }

  async updateClientProfile(userId: string, dto: UpdateClientProfileDto) {
    const clientProfile = await this.prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!clientProfile) {
      throw new NotFoundException('Client profile not found for this user.');
    }

    return this.prisma.clientProfile.update({
      where: { userId },
      data: dto,
    });
  }

  async updateFreelancerProfile(userId: string, dto: UpdateFreelancerProfileDto) {
    const freelancerProfile = await this.prisma.freelancerProfile.findUnique({
      where: { userId },
    });

    if (!freelancerProfile) {
      throw new NotFoundException('Freelancer profile not found for this user.');
    }

    return this.prisma.freelancerProfile.update({
      where: { userId },
      data: dto,
    });
  }
}
