import { Injectable, NotFoundException } from '@nestjs/common';
import { JobStatus, Prisma, ProposalStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { AuditLoggerService } from '../../audit/services/audit-logger.service.js';
import { AdminJobQueryDto } from '../dto/admin-job-query.dto.js';
import { AdminUpdateJobDto } from '../dto/admin-update-job.dto.js';
import { AdminUpdateProposalDto } from '../dto/admin-update-proposal.dto.js';

@Injectable()
export class AdminJobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogger: AuditLoggerService,
  ) {}

  /**
   * Retrieves all jobs across all clients with filtering and pagination.
   */
  async getAllJobs(query: AdminJobQueryDto) {
    const { status, clientId, category, q, isFlagged, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = {
      ...(status ? { status } : {}),
      ...(clientId ? { clientId } : {}),
      ...(isFlagged !== undefined ? { isFlagged } : {}),
      ...(category
        ? {
            OR: [
              { categoryName: { equals: category, mode: 'insensitive' } },
              { category: { is: { name: { equals: category, mode: 'insensitive' } } } },
            ],
          }
        : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              email: true,
              clientProfile: {
                select: { companyName: true, totalSpent: true, rating: true },
              },
            },
          },
          category: true,
          subCategory: true,
          _count: {
            select: { proposals: true, contracts: true },
          },
          jobReports: {
            select: { id: true, reason: true, status: true },
          },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retrieves complete dossier for a job.
   */
  async getJobDetails(jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            createdAt: true,
            clientProfile: true,
          },
        },
        category: true,
        subCategory: true,
        contracts: {
          include: {
            freelancer: {
              select: { id: true, email: true, freelancerProfile: true },
            },
          },
        },
        jobReports: {
          include: {
            reporter: { select: { id: true, email: true } },
          },
        },
        _count: {
          select: { proposals: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found.');
    }

    return job;
  }

  /**
   * Updates any job's metadata, budget, or status.
   */
  async updateJob(adminId: string, jobId: string, dto: AdminUpdateJobDto) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found.');
    }

    const { category, subCategory, adminReason, ...rest } = dto;

    const updatedJob = await this.prisma.job.update({
      where: { id: jobId },
      data: {
        ...rest,
        ...(category && { categoryName: category }),
        ...(subCategory !== undefined && { subCategoryName: subCategory }),
      },
    });

    await this.auditLogger.logAction({
      adminId,
      action: 'JOB_UPDATED',
      targetType: 'JOB',
      targetId: jobId,
      details: adminReason || 'Job updated by administrator',
    });

    return updatedJob;
  }

  /**
   * Force cancels a job and rejects all pending proposals.
   */
  async cancelJob(adminId: string, jobId: string, reason?: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found.');
    }

    const canceledJob = await this.prisma.$transaction(async (tx) => {
      const canceled = await tx.job.update({
        where: { id: jobId },
        data: { status: JobStatus.CANCELED },
      });

      await tx.proposal.updateMany({
        where: { jobId, status: ProposalStatus.PENDING },
        data: { status: ProposalStatus.REJECTED },
      });

      return canceled;
    });

    await this.auditLogger.logAction({
      adminId,
      action: 'JOB_CANCELED',
      targetType: 'JOB',
      targetId: jobId,
      details: reason || 'Job cancelled by administrator',
    });

    return {
      message: 'Job cancelled successfully and pending proposals rejected.',
      job: canceledJob,
    };
  }

  /**
   * Retrieves all proposals submitted under a specific job.
   */
  async getJobProposals(jobId: string, page = 1, limit = 20) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found.');
    }

    const skip = (page - 1) * limit;

    const [proposals, total] = await Promise.all([
      this.prisma.proposal.findMany({
        where: { jobId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          freelancer: {
            select: {
              id: true,
              email: true,
              createdAt: true,
              freelancerProfile: {
                select: {
                  title: true,
                  rating: true,
                  totalReviews: true,
                  successRate: true,
                  earnings: true,
                  hourlyRate: true,
                  skills: true,
                },
              },
            },
          },
          contract: {
            select: { id: true, status: true, escrowAmount: true },
          },
        },
      }),
      this.prisma.proposal.count({ where: { jobId } }),
    ]);

    return {
      proposals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retrieves full details for a single proposal.
   */
  async getProposalDetails(proposalId: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        job: true,
        freelancer: {
          select: {
            id: true,
            email: true,
            freelancerProfile: {
              include: { portfolioItems: true },
            },
            workHistories: true,
          },
        },
        contract: true,
        conversation: true,
      },
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found.');
    }

    return proposal;
  }

  /**
   * Updates proposal status from the admin console.
   */
  async updateProposalStatus(
    adminId: string,
    proposalId: string,
    dto: AdminUpdateProposalDto,
  ) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found.');
    }

    const updated = await this.prisma.proposal.update({
      where: { id: proposalId },
      data: { status: dto.status },
    });

    await this.auditLogger.logAction({
      adminId,
      action: 'PROPOSAL_STATUS_UPDATED',
      targetType: 'PROPOSAL',
      targetId: proposalId,
      details: dto.adminNotes || `Proposal status updated to ${dto.status} by admin`,
    });

    return updated;
  }
}
