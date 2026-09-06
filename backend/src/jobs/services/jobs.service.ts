import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JobStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateJobDto } from '../dto/create-job.dto.js';
import { UpdateJobDto } from '../dto/update-job.dto.js';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(clientId: string, dto: CreateJobDto) {
    const clientProfile = await this.prisma.clientProfile.findUnique({
      where: { userId: clientId },
    });

    if (!clientProfile) {
      throw new NotFoundException('Client profile not found. Only clients can post jobs.');
    }

    return await this.prisma.$transaction(async (tx) => {
      const job = await tx.job.create({
        data: {
          clientId,
          title: dto.title,
          description: dto.description,
          categoryName: dto.category,
          subCategoryName: dto.subCategory,
          budget: dto.budget,
          skills: dto.skills,
          status: JobStatus.OPEN,
        },
      });

      await tx.clientProfile.update({
        where: { userId: clientId },
        data: { totalJobPosts: { increment: 1 } },
      });

      return job;
    });
  }

  async getClientJobs(clientId: string) {
    return this.prisma.job.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        subCategory: true,
        _count: { select: { proposals: true } },
      },
    });
  }

  async updateJob(clientId: string, jobId: string, dto: UpdateJobDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job posting not found.');
    }

    if (job.clientId !== clientId) {
      throw new ForbiddenException('You do not have permission to update this job posting.');
    }

    const { category, subCategory, ...rest } = dto;

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        ...rest,
        ...(category && { categoryName: category }),
        ...(subCategory !== undefined && { subCategoryName: subCategory }),
      },
    });
  }

  async cancelJob(clientId: string, jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job posting not found.');
    }

    if (job.clientId !== clientId) {
      throw new ForbiddenException('You do not have permission to cancel this job posting.');
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: { status: JobStatus.CANCELED },
    });
  }
}
