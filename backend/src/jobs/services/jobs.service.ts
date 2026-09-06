import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JobStatus } from '@prisma/client';
import { AntiCircumventionService } from '../../admin/moderation/services/anti-circumvention.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateJobDto } from '../dto/create-job.dto.js';
import { ReportJobDto } from '../dto/report-job.dto.js';
import { UpdateJobDto } from '../dto/update-job.dto.js';

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly antiCircumventionService: AntiCircumventionService,
  ) {}

  async createJob(clientId: string, dto: CreateJobDto) {
    const clientProfile = await this.prisma.clientProfile.findUnique({
      where: { userId: clientId },
    });

    if (!clientProfile) {
      throw new NotFoundException('Client profile not found. Only clients can post jobs.');
    }

    const titleScan = this.antiCircumventionService.scanContent(dto.title);
    const descScan = this.antiCircumventionService.scanContent(dto.description);
    const isFlagged = titleScan.isFlagged || descScan.isFlagged;
    const flagReason = isFlagged
      ? [...titleScan.reasons, ...descScan.reasons].join('; ')
      : null;

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
          isFlagged,
          flagReason,
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

    let isFlagged = job.isFlagged;
    let flagReason = job.flagReason;

    if (dto.title !== undefined || dto.description !== undefined) {
      const titleToScan = dto.title ?? job.title;
      const descToScan = dto.description ?? job.description;
      const titleScan = this.antiCircumventionService.scanContent(titleToScan);
      const descScan = this.antiCircumventionService.scanContent(descToScan);
      isFlagged = titleScan.isFlagged || descScan.isFlagged;
      flagReason = isFlagged
        ? [...titleScan.reasons, ...descScan.reasons].join('; ')
        : null;
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        ...rest,
        ...(category && { categoryName: category }),
        ...(subCategory !== undefined && { subCategoryName: subCategory }),
        isFlagged,
        flagReason,
      },
    });
  }

  async reportJob(reporterId: string, jobId: string, dto: ReportJobDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job listing not found.');
    }

    return await this.prisma.$transaction(async (tx) => {
      const report = await tx.jobReport.create({
        data: {
          jobId,
          reporterId,
          reason: dto.reason,
          status: 'PENDING',
        },
      });

      // Quarantine job if not already flagged
      if (!job.isFlagged) {
        await tx.job.update({
          where: { id: jobId },
          data: {
            isFlagged: true,
            flagReason: `Community report: ${dto.reason}`,
          },
        });
      }

      return report;
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
