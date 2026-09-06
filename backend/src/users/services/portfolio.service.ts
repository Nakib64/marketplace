import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreatePortfolioItemDto } from '../dto/create-portfolio-item.dto.js';
import { UpdatePortfolioItemDto } from '../dto/update-portfolio-item.dto.js';

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  async addPortfolioItem(userId: string, dto: CreatePortfolioItemDto) {
    const freelancerProfile = await this.prisma.freelancerProfile.findUnique({
      where: { userId },
    });

    if (!freelancerProfile) {
      throw new NotFoundException('Only users with a Freelancer profile can create portfolio items.');
    }

    if (dto.images && dto.images.length > 7) {
      throw new BadRequestException('A portfolio project can contain a maximum of 7 images.');
    }

    return this.prisma.portfolioItem.create({
      data: {
        freelancerProfileId: freelancerProfile.id,
        title: dto.title,
        details: dto.details,
        liveLink: dto.liveLink,
        images: {
          create: (dto.images || []).map((img, index) => ({
            imageUrl: img.imageUrl,
            subtitle: img.subtitle,
            order: index,
          })),
        },
      },
      include: {
        images: { orderBy: { order: 'asc' } },
      },
    });
  }

  async updatePortfolioItem(
    userId: string,
    portfolioItemId: string,
    dto: UpdatePortfolioItemDto,
  ) {
    const portfolioItem = await this.prisma.portfolioItem.findUnique({
      where: { id: portfolioItemId },
      include: { freelancerProfile: true },
    });

    if (!portfolioItem) {
      throw new NotFoundException('Portfolio project not found.');
    }

    if (portfolioItem.freelancerProfile.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this portfolio project.');
    }

    if (dto.images && dto.images.length > 7) {
      throw new BadRequestException('A portfolio project can contain a maximum of 7 images.');
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.images) {
        await tx.portfolioImage.deleteMany({
          where: { portfolioItemId },
        });

        await tx.portfolioImage.createMany({
          data: dto.images.map((img, index) => ({
            portfolioItemId,
            imageUrl: img.imageUrl,
            subtitle: img.subtitle,
            order: index,
          })),
        });
      }

      return tx.portfolioItem.update({
        where: { id: portfolioItemId },
        data: {
          ...(dto.title && { title: dto.title }),
          ...(dto.details && { details: dto.details }),
          ...(dto.liveLink !== undefined && { liveLink: dto.liveLink }),
        },
        include: {
          images: { orderBy: { order: 'asc' } },
        },
      });
    });
  }

  async deletePortfolioItem(userId: string, portfolioItemId: string) {
    const portfolioItem = await this.prisma.portfolioItem.findUnique({
      where: { id: portfolioItemId },
      include: { freelancerProfile: true },
    });

    if (!portfolioItem) {
      throw new NotFoundException('Portfolio project not found.');
    }

    if (portfolioItem.freelancerProfile.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this portfolio project.');
    }

    await this.prisma.portfolioItem.delete({
      where: { id: portfolioItemId },
    });

    return { message: 'Portfolio project deleted successfully.' };
  }
}
