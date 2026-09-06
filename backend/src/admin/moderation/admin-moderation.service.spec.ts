import { NotFoundException } from '@nestjs/common';
import { JobStatus, ProposalStatus } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ModerateJobAction } from './dto/moderate-job.dto.js';
import { AdminModerationService } from './services/admin-moderation.service.js';
import { AntiCircumventionService } from './services/anti-circumvention.service.js';

describe('Phase 13: Moderation & Anti-Circumvention', () => {
  describe('AntiCircumventionService', () => {
    let scanner: AntiCircumventionService;

    beforeEach(() => {
      scanner = new AntiCircumventionService();
    });

    it('should detect standard Bangladeshi mobile numbers', () => {
      const text1 = 'Please call me at 01712345678 for details.';
      const text2 = 'Contact our lead dev: +8801812345678 today.';
      const text3 = 'WhatsApp/Call: 01912-345678.';

      expect(scanner.scanContent(text1).isFlagged).toBe(true);
      expect(scanner.scanContent(text2).isFlagged).toBe(true);
      expect(scanner.scanContent(text3).isFlagged).toBe(true);
    });

    it('should detect spaced phone number evasion attempts', () => {
      const deceptiveText = 'Call my number 0 1 7 1 2 3 4 5 6 7 8 directly';
      const res = scanner.scanContent(deceptiveText);
      expect(res.isFlagged).toBe(true);
      expect(res.reasons).toContain('Contains phone number pattern');
    });

    it('should detect prohibited communication and payment keywords', () => {
      const text = 'Add me on Telegram and we can arrange personal bkash payment.';
      const res = scanner.scanContent(text);
      expect(res.isFlagged).toBe(true);
      expect(res.reasons.some((r) => r.includes('telegram'))).toBe(true);
      expect(res.reasons.some((r) => r.includes('personal bkash'))).toBe(true);
    });

    it('should detect external email addresses and messaging shortlinks', () => {
      const text = 'Send your CV to dev.hire@company.com or message t.me/dev_team';
      const res = scanner.scanContent(text);
      expect(res.isFlagged).toBe(true);
      expect(res.reasons).toContain('Contains email address pattern');
      expect(res.reasons).toContain('Contains off-platform messaging link');
    });

    it('should pass clean job descriptions', () => {
      const cleanText =
        'We need a full-stack Next.js and NestJS developer to build our marketplace backend using Prisma and PostgreSQL.';
      const res = scanner.scanContent(cleanText);
      expect(res.isFlagged).toBe(false);
      expect(res.reasons).toHaveLength(0);
    });
  });

  describe('AdminModerationService', () => {
    let service: AdminModerationService;
    let prismaMock: any;
    let auditLoggerMock: any;
    let reviewsServiceMock: any;

    beforeEach(() => {
      prismaMock = {
        job: {
          findMany: vi.fn(),
          count: vi.fn(),
          findUnique: vi.fn(),
          update: vi.fn(),
        },
        jobReport: {
          findMany: vi.fn(),
          count: vi.fn(),
          updateMany: vi.fn(),
        },
        proposal: {
          updateMany: vi.fn(),
        },
        review: {
          findMany: vi.fn(),
          count: vi.fn(),
          findUnique: vi.fn(),
          delete: vi.fn(),
        },
        $transaction: vi.fn((cb) => cb(prismaMock)),
      };

      auditLoggerMock = {
        logAction: vi.fn().mockResolvedValue({ id: 'audit-1' }),
      };

      reviewsServiceMock = {
        recalculateFreelancerStats: vi.fn().mockResolvedValue(undefined),
        recalculateClientStats: vi.fn().mockResolvedValue(undefined),
      };

      service = new AdminModerationService(
        prismaMock,
        auditLoggerMock as any,
        reviewsServiceMock as any,
      );
    });

    describe('getFlaggedJobs', () => {
      it('should return paginated flagged jobs with count', async () => {
        prismaMock.job.findMany.mockResolvedValue([
          { id: 'job-1', title: 'Suspicious Job', isFlagged: true },
        ]);
        prismaMock.job.count.mockResolvedValue(1);

        const res = await service.getFlaggedJobs({ page: 1, limit: 10 });
        expect(res.jobs).toHaveLength(1);
        expect(res.pagination.total).toBe(1);
        expect(res.pagination.totalPages).toBe(1);
      });
    });

    describe('moderateJob', () => {
      it('should throw NotFoundException if job does not exist', async () => {
        prismaMock.job.findUnique.mockResolvedValue(null);

        await expect(
          service.moderateJob('admin-1', 'invalid-job', {
            action: ModerateJobAction.APPROVE,
          }),
        ).rejects.toThrow(NotFoundException);
      });

      it('should APPROVE job: clear isFlagged, restore status to OPEN, and resolve reports', async () => {
        prismaMock.job.findUnique.mockResolvedValue({
          id: 'job-1',
          status: JobStatus.OPEN,
          isFlagged: true,
          flagReason: 'Phone number detected',
          client: { id: 'client-1', email: 'client@test.com' },
        });

        prismaMock.job.update.mockResolvedValue({
          id: 'job-1',
          status: JobStatus.OPEN,
          isFlagged: false,
          flagReason: null,
        });

        const res = await service.moderateJob('admin-1', 'job-1', {
          action: ModerateJobAction.APPROVE,
          adminNotes: 'Cleaned and verified legitimate job post.',
        });

        expect(prismaMock.job.update).toHaveBeenCalledWith({
          where: { id: 'job-1' },
          data: {
            isFlagged: false,
            flagReason: null,
            status: JobStatus.OPEN,
          },
        });
        expect(prismaMock.jobReport.updateMany).toHaveBeenCalledWith({
          where: { jobId: 'job-1', status: 'PENDING' },
          data: { status: 'RESOLVED' },
        });
        expect(auditLoggerMock.logAction).toHaveBeenCalledWith(
          expect.objectContaining({
            adminId: 'admin-1',
            action: 'JOB_APPROVED',
            targetType: 'JOB',
            targetId: 'job-1',
          }),
        );
        expect(res?.job.isFlagged).toBe(false);
      });

      it('should TERMINATE job: cancel job, reject proposals, resolve reports, and log audit', async () => {
        prismaMock.job.findUnique.mockResolvedValue({
          id: 'job-2',
          status: JobStatus.OPEN,
          isFlagged: true,
          flagReason: 'Prohibited off-platform payment terms',
          client: { id: 'client-2', email: 'client2@test.com' },
        });

        prismaMock.job.update.mockResolvedValue({
          id: 'job-2',
          status: JobStatus.CANCELED,
          isFlagged: true,
          flagReason: 'Violated off-platform payment policy',
        });

        const res = await service.moderateJob('admin-1', 'job-2', {
          action: ModerateJobAction.TERMINATE,
          adminNotes: 'Violated off-platform payment policy',
        });

        expect(prismaMock.job.update).toHaveBeenCalledWith({
          where: { id: 'job-2' },
          data: {
            status: JobStatus.CANCELED,
            isFlagged: true,
            flagReason: 'Violated off-platform payment policy',
          },
        });
        expect(prismaMock.proposal.updateMany).toHaveBeenCalledWith({
          where: { jobId: 'job-2', status: ProposalStatus.PENDING },
          data: { status: ProposalStatus.REJECTED },
        });
        expect(prismaMock.jobReport.updateMany).toHaveBeenCalledWith({
          where: { jobId: 'job-2', status: 'PENDING' },
          data: { status: 'RESOLVED' },
        });
        expect(auditLoggerMock.logAction).toHaveBeenCalledWith(
          expect.objectContaining({
            adminId: 'admin-1',
            action: 'JOB_TERMINATED',
            targetType: 'JOB',
            targetId: 'job-2',
          }),
        );
        expect(res?.job.status).toBe(JobStatus.CANCELED);
      });
    });

    describe('deleteReview', () => {
      it('should throw NotFoundException if review does not exist', async () => {
        prismaMock.review.findUnique.mockResolvedValue(null);

        await expect(
          service.deleteReview('admin-1', 'nonexistent-review', {
            reason: 'Defamatory language',
          }),
        ).rejects.toThrow(NotFoundException);
      });

      it('should delete review, recalculate profile stats, and log audit', async () => {
        prismaMock.review.findUnique.mockResolvedValue({
          id: 'rev-100',
          reviewerId: 'user-client',
          revieweeId: 'user-free',
          contract: {
            clientId: 'user-client',
            freelancerId: 'user-free',
          },
        });

        const res = await service.deleteReview('admin-1', 'rev-100', {
          reason: 'Defamatory review following dispute',
        });

        expect(prismaMock.review.delete).toHaveBeenCalledWith({
          where: { id: 'rev-100' },
        });
        expect(reviewsServiceMock.recalculateFreelancerStats).toHaveBeenCalledWith(
          prismaMock,
          'user-free',
        );
        expect(reviewsServiceMock.recalculateClientStats).toHaveBeenCalledWith(
          prismaMock,
          'user-client',
        );
        expect(auditLoggerMock.logAction).toHaveBeenCalledWith(
          expect.objectContaining({
            adminId: 'admin-1',
            action: 'REVIEW_DELETED',
            targetType: 'REVIEW',
            targetId: 'rev-100',
          }),
        );
        expect(res.message).toContain('Review successfully removed');
      });
    });

    describe('getJobReports', () => {
      it('should return paginated job reports', async () => {
        prismaMock.jobReport.findMany.mockResolvedValue([
          { id: 'rep-1', jobId: 'job-1', reason: 'Spam job' },
        ]);
        prismaMock.jobReport.count.mockResolvedValue(1);

        const res = await service.getJobReports({ page: 1, limit: 10 });
        expect(res.reports).toHaveLength(1);
        expect(res.pagination.total).toBe(1);
      });
    });
  });
});
