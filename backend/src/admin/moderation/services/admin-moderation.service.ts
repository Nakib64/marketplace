import { Injectable, NotFoundException } from '@nestjs/common';
import { JobStatus, Prisma, ProposalStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { ReviewsService } from '../../../reviews/services/reviews.service.js';
import { AuditLoggerService } from '../../audit/services/audit-logger.service.js';
import { DeleteReviewDto } from '../dto/delete-review.dto.js';
import { ModerateJobAction, ModerateJobDto } from '../dto/moderate-job.dto.js';
import { ModerationQueryDto } from '../dto/moderation-query.dto.js';

@Injectable()
export class AdminModerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogger: AuditLoggerService,
    private readonly reviewsService: ReviewsService,
  ) {}

  /**
   * Retrieves paginated list of flagged or reported jobs.
   */
  async getFlaggedJobs(query: ModerationQueryDto) {
    const { status, isFlagged = true, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = {
      ...(isFlagged !== undefined ? { isFlagged } : {}),
      ...(status ? { status: status as JobStatus } : {}),
    };

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              email: true,
              clientProfile: { select: { companyName: true, totalSpent: true, rating: true } },
            },
          },
          jobReports: {
            include: {
              reporter: { select: { id: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: { select: { proposals: true } },
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
   * Moderates a job listing (APPROVE to restore, or TERMINATE to cancel).
   */
  async moderateJob(adminId: string, jobId: string, dto: ModerateJobDto) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { client: { select: { id: true, email: true } } },
    });

    if (!job) {
      throw new NotFoundException('Job listing not found.');
    }

    if (dto.action === ModerateJobAction.APPROVE) {
      const updatedJob = await this.prisma.$transaction(async (tx) => {
        const approved = await tx.job.update({
          where: { id: jobId },
          data: {
            isFlagged: false,
            flagReason: null,
            status: JobStatus.OPEN,
          },
        });

        // Resolve pending community reports for this job
        await tx.jobReport.updateMany({
          where: { jobId, status: 'PENDING' },
          data: { status: 'RESOLVED' },
        });

        return approved;
      });

      await this.auditLogger.logAction({
        adminId,
        action: 'JOB_APPROVED',
        targetType: 'JOB',
        targetId: jobId,
        details: dto.adminNotes || 'Job flag cleared and listing restored to OPEN.',
      });

      return {
        message: 'Job approved and returned to OPEN status.',
        job: updatedJob,
      };
    }

    if (dto.action === ModerateJobAction.TERMINATE) {
      const terminatedJob = await this.prisma.$transaction(async (tx) => {
        const terminated = await tx.job.update({
          where: { id: jobId },
          data: {
            status: JobStatus.CANCELED,
            isFlagged: true,
            flagReason: dto.adminNotes || job.flagReason || 'Terminated by platform moderation.',
          },
        });

        // Reject any pending proposals submitted for this job
        await tx.proposal.updateMany({
          where: { jobId, status: ProposalStatus.PENDING },
          data: { status: ProposalStatus.REJECTED },
        });

        // Resolve pending community reports for this job
        await tx.jobReport.updateMany({
          where: { jobId, status: 'PENDING' },
          data: { status: 'RESOLVED' },
        });

        return terminated;
      });

      await this.auditLogger.logAction({
        adminId,
        action: 'JOB_TERMINATED',
        targetType: 'JOB',
        targetId: jobId,
        details: dto.adminNotes || 'Job terminated due to platform policy or circumvention violation.',
      });

      return {
        message: 'Job terminated and all pending proposals rejected.',
        job: terminatedJob,
      };
    }
  }

  /**
   * Retrieves flagged or disputed reviews requiring moderation.
   */
  async getFlaggedReviews(query: ModerationQueryDto) {
    const { page = 1, limit = 20, isFlagged } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {
      ...(isFlagged !== undefined ? { isFlagged } : {}),
    };

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reviewer: { select: { id: true, email: true, role: true } },
          reviewee: { select: { id: true, email: true, role: true } },
          contract: { select: { id: true, status: true, escrowAmount: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Deletes a defamatory or policy-violating review and recalculates affected ratings.
   */
  async deleteReview(adminId: string, reviewId: string, dto: DeleteReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        contract: {
          select: {
            clientId: true,
            freelancerId: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found.');
    }

    await this.prisma.$transaction(async (tx) => {
      // 1. Delete the review
      await tx.review.delete({
        where: { id: reviewId },
      });

      // 2. Automatically recompute both freelancer and client stats
      await this.reviewsService.recalculateFreelancerStats(tx, review.contract.freelancerId);
      await this.reviewsService.recalculateClientStats(tx, review.contract.clientId);
    });

    // 3. Log permanent audit trail
    await this.auditLogger.logAction({
      adminId,
      action: 'REVIEW_DELETED',
      targetType: 'REVIEW',
      targetId: reviewId,
      details: `Removed review by ${review.reviewerId} for ${review.revieweeId}. Reason: ${dto.reason}`,
    });

    return {
      message: 'Review successfully removed and affected user ratings recalculated.',
    };
  }

  /**
   * Retrieves all community job reports.
   */
  async getJobReports(query: ModerationQueryDto) {
    const { status = 'PENDING', page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.JobReportWhereInput = {
      ...(status ? { status } : {}),
    };

    const [reports, total] = await Promise.all([
      this.prisma.jobReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: { select: { id: true, email: true } },
          job: {
            select: {
              id: true,
              title: true,
              status: true,
              isFlagged: true,
              flagReason: true,
            },
          },
        },
      }),
      this.prisma.jobReport.count({ where }),
    ]);

    return {
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
