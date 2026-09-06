import { NotFoundException } from '@nestjs/common';
import { JobStatus, ProposalStatus } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminJobsService } from './services/admin-jobs.service.js';

describe('AdminJobsService', () => {
  let service: AdminJobsService;
  let prismaMock: any;
  let auditLoggerMock: any;

  beforeEach(() => {
    prismaMock = {
      job: {
        findMany: vi.fn(),
        count: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      proposal: {
        findMany: vi.fn(),
        count: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      $transaction: vi.fn(async (cb: any) => cb(prismaMock)),
    };

    auditLoggerMock = {
      logAction: vi.fn().mockResolvedValue({ id: 'audit-log-id' }),
    };

    service = new AdminJobsService(prismaMock, auditLoggerMock as any);
  });

  describe('getAllJobs', () => {
    it('should return paginated jobs with totalPages calculated', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          title: 'Fullstack Next.js App',
          status: JobStatus.OPEN,
          budget: 1500,
        },
      ];
      prismaMock.job.findMany.mockResolvedValue(mockJobs);
      prismaMock.job.count.mockResolvedValue(1);

      const result = await service.getAllJobs({ page: 1, limit: 10 });

      expect(result.jobs).toHaveLength(1);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
      expect(prismaMock.job.findMany).toHaveBeenCalled();
    });
  });

  describe('getJobDetails', () => {
    it('should return complete job details when job exists', async () => {
      const mockJob = {
        id: 'job-1',
        title: 'Fullstack Next.js App',
        client: { id: 'client-1', email: 'client@example.com' },
        jobReports: [],
      };
      prismaMock.job.findUnique.mockResolvedValue(mockJob);

      const result = await service.getJobDetails('job-1');
      expect(result).toEqual(mockJob);
      expect(prismaMock.job.findUnique).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if job does not exist', async () => {
      prismaMock.job.findUnique.mockResolvedValue(null);

      await expect(service.getJobDetails('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateJob', () => {
    it('should update job fields and log an audit entry', async () => {
      prismaMock.job.findUnique.mockResolvedValue({ id: 'job-1' });
      prismaMock.job.update.mockResolvedValue({
        id: 'job-1',
        title: 'Updated Title',
        budget: 2000,
      });

      const result = await service.updateJob('admin-1', 'job-1', {
        title: 'Updated Title',
        budget: 2000,
        adminReason: 'Refined title for clarity',
      });

      expect(result.title).toBe('Updated Title');
      expect(auditLoggerMock.logAction).toHaveBeenCalledWith({
        adminId: 'admin-1',
        action: 'JOB_UPDATED',
        targetType: 'JOB',
        targetId: 'job-1',
        details: 'Refined title for clarity',
      });
    });

    it('should throw NotFoundException if job to update does not exist', async () => {
      prismaMock.job.findUnique.mockResolvedValue(null);

      await expect(
        service.updateJob('admin-1', 'invalid', { title: 'New' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancelJob', () => {
    it('should cancel job and reject pending proposals in a transaction', async () => {
      prismaMock.job.findUnique.mockResolvedValue({ id: 'job-1', status: JobStatus.OPEN });
      prismaMock.job.update.mockResolvedValue({
        id: 'job-1',
        status: JobStatus.CANCELED,
      });

      const result = await service.cancelJob('admin-1', 'job-1', 'Violated terms');

      expect(result.message).toContain('cancelled successfully');
      expect(prismaMock.proposal.updateMany).toHaveBeenCalledWith({
        where: { jobId: 'job-1', status: ProposalStatus.PENDING },
        data: { status: ProposalStatus.REJECTED },
      });
      expect(auditLoggerMock.logAction).toHaveBeenCalledWith({
        adminId: 'admin-1',
        action: 'JOB_CANCELED',
        targetType: 'JOB',
        targetId: 'job-1',
        details: 'Violated terms',
      });
    });

    it('should throw NotFoundException if job does not exist', async () => {
      prismaMock.job.findUnique.mockResolvedValue(null);

      await expect(
        service.cancelJob('admin-1', 'invalid'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getJobProposals', () => {
    it('should return paginated proposals for a valid job', async () => {
      prismaMock.job.findUnique.mockResolvedValue({ id: 'job-1' });
      prismaMock.proposal.findMany.mockResolvedValue([
        { id: 'prop-1', bidAmount: 500, status: ProposalStatus.PENDING },
      ]);
      prismaMock.proposal.count.mockResolvedValue(1);

      const result = await service.getJobProposals('job-1', 1, 10);

      expect(result.proposals).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('should throw NotFoundException if job does not exist', async () => {
      prismaMock.job.findUnique.mockResolvedValue(null);

      await expect(service.getJobProposals('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProposalDetails', () => {
    it('should return full proposal dossier if proposal exists', async () => {
      const mockProposal = {
        id: 'prop-1',
        bidAmount: 750,
        freelancer: { id: 'fl-1', email: 'fl@example.com' },
      };
      prismaMock.proposal.findUnique.mockResolvedValue(mockProposal);

      const result = await service.getProposalDetails('prop-1');

      expect(result).toEqual(mockProposal);
    });

    it('should throw NotFoundException if proposal does not exist', async () => {
      prismaMock.proposal.findUnique.mockResolvedValue(null);

      await expect(service.getProposalDetails('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProposalStatus', () => {
    it('should update proposal status and log audit action', async () => {
      prismaMock.proposal.findUnique.mockResolvedValue({
        id: 'prop-1',
        status: ProposalStatus.PENDING,
      });
      prismaMock.proposal.update.mockResolvedValue({
        id: 'prop-1',
        status: ProposalStatus.ACCEPTED,
      });

      const result = await service.updateProposalStatus('admin-1', 'prop-1', {
        status: ProposalStatus.ACCEPTED,
        adminNotes: 'Admin override to accepted',
      });

      expect(result.status).toBe(ProposalStatus.ACCEPTED);
      expect(auditLoggerMock.logAction).toHaveBeenCalledWith({
        adminId: 'admin-1',
        action: 'PROPOSAL_STATUS_UPDATED',
        targetType: 'PROPOSAL',
        targetId: 'prop-1',
        details: 'Admin override to accepted',
      });
    });

    it('should throw NotFoundException if proposal does not exist', async () => {
      prismaMock.proposal.findUnique.mockResolvedValue(null);

      await expect(
        service.updateProposalStatus('admin-1', 'invalid', {
          status: ProposalStatus.REJECTED,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
