import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ContractStatus, JobStatus } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminDisputesQueryService } from './services/admin-disputes-query.service.js';
import { AdminDisputesVerdictsService } from './services/admin-disputes-verdicts.service.js';

describe('Admin Disputes Sub-Services', () => {
  let queryService: AdminDisputesQueryService;
  let verdictsService: AdminDisputesVerdictsService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      contract: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      user: {
        update: vi.fn(),
      },
      job: {
        update: vi.fn(),
      },
      freelancerProfile: {
        update: vi.fn(),
      },
      clientProfile: {
        update: vi.fn(),
      },
      refund: {
        create: vi.fn(),
      },
      $transaction: vi.fn((cb) => cb(prismaMock)),
    };

    queryService = new AdminDisputesQueryService(prismaMock);
    verdictsService = new AdminDisputesVerdictsService(prismaMock);
  });

  describe('AdminDisputesQueryService', () => {
    it('should list contracts in DISPUTED status', async () => {
      prismaMock.contract.findMany.mockResolvedValue([
        { id: 'c-1', status: ContractStatus.DISPUTED },
      ]);

      const res = await queryService.getDisputes();
      expect(res).toHaveLength(1);
      expect(res[0].id).toBe('c-1');
    });

    it('should throw NotFoundException if dispute dossier not found', async () => {
      prismaMock.contract.findUnique.mockResolvedValue(null);

      await expect(queryService.getDisputeDossier('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('AdminDisputesVerdictsService.forceRefundToClient', () => {
    it('should throw BadRequestException if contract is not DISPUTED', async () => {
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'c-1',
        status: ContractStatus.FUNDED,
      });

      await expect(
        verdictsService.forceRefundToClient('admin-1', 'c-1', {
          adminNotes: 'Deliverables failed completely',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should refund 100% escrow to client, cancel job, and record refund', async () => {
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'c-1',
        jobId: 'j-1',
        clientId: 'client-1',
        freelancerId: 'free-1',
        escrowAmount: 2000,
        status: ContractStatus.DISPUTED,
      });
      prismaMock.contract.update.mockResolvedValue({
        id: 'c-1',
        status: ContractStatus.REFUNDED,
      });
      prismaMock.refund.create.mockResolvedValue({
        id: 'r-1',
        contractId: 'c-1',
        amount: 2000,
      });

      const res = await verdictsService.forceRefundToClient('admin-1', 'c-1', {
        adminNotes: 'Freelancer abandoned project without response.',
      });

      expect(res.verdict).toBe('FULL_REFUND');
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        data: { walletBalance: { increment: 2000 } },
      });
      expect(prismaMock.job.update).toHaveBeenCalledWith({
        where: { id: 'j-1' },
        data: { status: JobStatus.CANCELED },
      });
    });
  });

  describe('AdminDisputesVerdictsService.forceReleaseToFreelancer', () => {
    it('should release net payout to freelancer, complete job, and update earnings', async () => {
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'c-1',
        jobId: 'j-1',
        clientId: 'client-1',
        freelancerId: 'free-1',
        escrowAmount: 2000,
        platformFee: 200,
        status: ContractStatus.DISPUTED,
      });
      prismaMock.contract.update.mockResolvedValue({
        id: 'c-1',
        status: ContractStatus.COMPLETED,
      });

      const res = await verdictsService.forceReleaseToFreelancer('admin-1', 'c-1', {
        adminNotes: 'Deliverables satisfied original job specification.',
      });

      expect(res.verdict).toBe('FULL_RELEASE');
      expect(res.netPayout).toBe(1800);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'free-1' },
        data: { walletBalance: { increment: 1800 } },
      });
      expect(prismaMock.job.update).toHaveBeenCalledWith({
        where: { id: 'j-1' },
        data: { status: JobStatus.COMPLETED },
      });
    });
  });

  describe('AdminDisputesVerdictsService.resolveSplitSettlement', () => {
    it('should execute proportional split between client refund and freelancer net payout', async () => {
      // Escrow: 1000, 10% fee rate -> platformFee = 100
      // 40% client refund -> 400 BDT to client
      // 600 BDT gross to freelancer -> 10% fee on 600 = 60 BDT fee -> 540 BDT net to freelancer
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'c-1',
        jobId: 'j-1',
        clientId: 'client-1',
        freelancerId: 'free-1',
        escrowAmount: 1000,
        platformFee: 100,
        status: ContractStatus.DISPUTED,
      });
      prismaMock.contract.update.mockResolvedValue({
        id: 'c-1',
        status: ContractStatus.COMPLETED,
      });
      prismaMock.refund.create.mockResolvedValue({
        id: 'r-1',
        amount: 400,
      });

      const res = await verdictsService.resolveSplitSettlement('admin-1', 'c-1', {
        clientRefundPercentage: 40,
        adminNotes: 'Milestone 1 completed, milestone 2 canceled by mutual agreement.',
      });

      expect(res.verdict).toBe('SPLIT_SETTLEMENT');
      expect(res.clientRefund).toBe(400);
      expect(res.freelancerNet).toBe(540);
      expect(res.platformFee).toBe(60);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        data: { walletBalance: { increment: 400 } },
      });
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'free-1' },
        data: { walletBalance: { increment: 540 } },
      });
    });
  });
});
