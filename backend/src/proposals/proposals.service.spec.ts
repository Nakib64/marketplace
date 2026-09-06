import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JobStatus } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ClientProposalsService } from './services/client-proposals.service.js';
import { ProposalsService } from './services/proposals.service.js';

describe('Proposals Services (Freelancer & Client)', () => {
  let proposalsService: ProposalsService;
  let clientProposalsService: ClientProposalsService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      job: {
        findUnique: vi.fn(),
      },
      proposal: {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
        delete: vi.fn(),
      },
    };

    proposalsService = new ProposalsService(prismaMock);
    clientProposalsService = new ClientProposalsService(prismaMock);
  });

  describe('ProposalsService (Freelancer)', () => {
    it('should submit a proposal successfully when job is OPEN', async () => {
      prismaMock.job.findUnique.mockResolvedValue({ id: 'job-1', status: JobStatus.OPEN });
      prismaMock.proposal.findUnique.mockResolvedValue(null);
      prismaMock.proposal.create.mockResolvedValue({
        id: 'prop-1',
        jobId: 'job-1',
        freelancerId: 'free-1',
        bidAmount: 500,
        coverLetter: 'I am an expert fullstack developer with 5 years experience.',
        workHistoryIds: ['wh-1'],
        portfolioItemIds: ['pf-1', 'pf-2'],
        isViewed: false,
      });

      const result = await proposalsService.submitProposal('job-1', 'free-1', {
        bidAmount: 500,
        coverLetter: 'I am an expert fullstack developer with 5 years experience.',
        workHistoryIds: ['wh-1'],
        portfolioItemIds: ['pf-1', 'pf-2'],
      });

      expect(result.id).toBe('prop-1');
      expect(result.isViewed).toBe(false);
      expect(prismaMock.proposal.create).toHaveBeenCalledWith({
        data: {
          jobId: 'job-1',
          freelancerId: 'free-1',
          bidAmount: 500,
          coverLetter: 'I am an expert fullstack developer with 5 years experience.',
          workHistoryIds: ['wh-1'],
          portfolioItemIds: ['pf-1', 'pf-2'],
        },
      });
    });

    it('should throw ConflictException if freelancer applies twice to same job', async () => {
      prismaMock.job.findUnique.mockResolvedValue({ id: 'job-1', status: JobStatus.OPEN });
      prismaMock.proposal.findUnique.mockResolvedValue({ id: 'existing-prop' });

      await expect(
        proposalsService.submitProposal('job-1', 'free-1', {
          bidAmount: 500,
          coverLetter: 'I am an expert fullstack developer with 5 years experience.',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if portfolio items exceed 4', async () => {
      prismaMock.job.findUnique.mockResolvedValue({ id: 'job-1', status: JobStatus.OPEN });
      prismaMock.proposal.findUnique.mockResolvedValue(null);

      await expect(
        proposalsService.submitProposal('job-1', 'free-1', {
          bidAmount: 500,
          coverLetter: 'I am an expert fullstack developer with 5 years experience.',
          portfolioItemIds: ['pf-1', 'pf-2', 'pf-3', 'pf-4', 'pf-5'],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow updating an unviewed proposal (isViewed === false)', async () => {
      prismaMock.proposal.findUnique.mockResolvedValue({
        id: 'prop-1',
        freelancerId: 'free-1',
        isViewed: false,
      });
      prismaMock.proposal.update.mockResolvedValue({
        id: 'prop-1',
        bidAmount: 600,
      });

      const result = await proposalsService.updateProposal('prop-1', 'free-1', { bidAmount: 600 });
      expect(result.bidAmount).toBe(600);
    });

    it('should throw ForbiddenException when updating a viewed proposal (isViewed === true)', async () => {
      prismaMock.proposal.findUnique.mockResolvedValue({
        id: 'prop-1',
        freelancerId: 'free-1',
        isViewed: true,
      });

      await expect(
        proposalsService.updateProposal('prop-1', 'free-1', { bidAmount: 600 }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('ClientProposalsService (Client)', () => {
    it('should fetch proposals and mark unviewed proposals as viewed', async () => {
      prismaMock.job.findUnique.mockResolvedValue({ id: 'job-1', clientId: 'client-1' });
      prismaMock.proposal.findMany.mockResolvedValue([
        { id: 'p1', isViewed: false },
        { id: 'p2', isViewed: true },
      ]);
      prismaMock.proposal.updateMany.mockResolvedValue({ count: 1 });

      const proposals = await clientProposalsService.getJobProposals('job-1', 'client-1');

      expect(proposals.length).toBe(2);
      expect(prismaMock.proposal.updateMany).toHaveBeenCalledWith({
        where: { id: { in: ['p1'] } },
        data: { isViewed: true },
      });
    });

    it('should throw ForbiddenException if client does not own the job post', async () => {
      prismaMock.job.findUnique.mockResolvedValue({ id: 'job-1', clientId: 'other-client' });

      await expect(
        clientProposalsService.getJobProposals('job-1', 'client-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
