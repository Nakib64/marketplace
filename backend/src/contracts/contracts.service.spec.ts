import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ContractStatus, JobStatus, ProposalStatus } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ContractsService } from './services/contracts.service.js';

describe('ContractsService', () => {
  let contractsService: ContractsService;
  let prismaMock: any;
  let sslCommerzMock: any;

  beforeEach(() => {
    prismaMock = {
      platformSetting: {
        findUnique: vi.fn(),
        create: vi.fn(),
        upsert: vi.fn(),
      },
      proposal: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      contract: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      user: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      freelancerProfile: {
        update: vi.fn(),
      },
      clientProfile: {
        update: vi.fn(),
      },
      job: {
        update: vi.fn(),
      },
      $transaction: vi.fn((cb) => cb(prismaMock)),
    };

    sslCommerzMock = {
      initPayment: vi.fn().mockResolvedValue({
        gatewayUrl: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php?tran_id=123',
        tranId: '123',
      }),
      validatePayload: vi.fn().mockReturnValue(true),
    };

    contractsService = new ContractsService(prismaMock, sslCommerzMock);
  });

  describe('getPlatformFeePercentage & updatePlatformFeePercentage', () => {
    it('should return default 10.0 when platform setting does not exist', async () => {
      prismaMock.platformSetting.findUnique.mockResolvedValue(null);
      prismaMock.platformSetting.create.mockResolvedValue({
        id: 'default',
        platformFeePercentage: 10.0,
      });

      const percentage = await contractsService.getPlatformFeePercentage();
      expect(percentage).toBe(10.0);
    });

    it('should update platform fee percentage successfully', async () => {
      prismaMock.platformSetting.upsert.mockResolvedValue({
        id: 'default',
        platformFeePercentage: 15.0,
      });

      const res = await contractsService.updatePlatformFeePercentage(15.0);
      expect(res.platformFeePercentage).toBe(15.0);
    });
  });

  describe('acceptProposal', () => {
    it('should throw NotFoundException if proposal does not exist', async () => {
      prismaMock.proposal.findUnique.mockResolvedValue(null);

      await expect(contractsService.acceptProposal('client-1', 'prop-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if client does not own the job', async () => {
      prismaMock.proposal.findUnique.mockResolvedValue({
        id: 'prop-1',
        job: { clientId: 'other-client', status: JobStatus.OPEN },
      });

      await expect(contractsService.acceptProposal('client-1', 'prop-1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should trigger gateway initialization when client wallet balance is insufficient', async () => {
      prismaMock.proposal.findUnique.mockResolvedValue({
        id: 'prop-1',
        jobId: 'job-1',
        freelancerId: 'free-1',
        bidAmount: 1000,
        status: ProposalStatus.PENDING,
        job: { id: 'job-1', clientId: 'client-1', status: JobStatus.OPEN },
      });
      prismaMock.contract.findUnique.mockResolvedValue(null);
      prismaMock.platformSetting.findUnique.mockResolvedValue({
        id: 'default',
        platformFeePercentage: 10.0,
      });
      prismaMock.user.findUnique.mockResolvedValue({ id: 'client-1', walletBalance: 200 });

      const res = await contractsService.acceptProposal('client-1', 'prop-1');

      expect(res.paymentRequired).toBe(true);
      expect(res.gatewayUrl).toBeDefined();
    });

    it('should lock escrow and create contract when client wallet balance is sufficient', async () => {
      prismaMock.proposal.findUnique.mockResolvedValue({
        id: 'prop-1',
        jobId: 'job-1',
        freelancerId: 'free-1',
        bidAmount: 1000,
        status: ProposalStatus.PENDING,
        job: { id: 'job-1', clientId: 'client-1', status: JobStatus.OPEN },
      });
      prismaMock.contract.findUnique.mockResolvedValue(null);
      prismaMock.platformSetting.findUnique.mockResolvedValue({
        id: 'default',
        platformFeePercentage: 10.0,
      });
      prismaMock.user.findUnique.mockResolvedValue({ id: 'client-1', walletBalance: 1500 });
      prismaMock.contract.create.mockResolvedValue({
        id: 'contract-1',
        proposalId: 'prop-1',
        jobId: 'job-1',
        clientId: 'client-1',
        freelancerId: 'free-1',
        escrowAmount: 1000,
        platformFee: 100,
        status: ContractStatus.FUNDED,
      });

      const res = await contractsService.acceptProposal('client-1', 'prop-1');

      expect(res.paymentRequired).toBe(false);
      expect(res.contract?.status).toBe(ContractStatus.FUNDED);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        data: { walletBalance: { decrement: 1000 } },
      });
    });
  });

  describe('submitWork & approveWork', () => {
    it('should allow freelancer to submit work for FUNDED contract', async () => {
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'contract-1',
        freelancerId: 'free-1',
        status: ContractStatus.FUNDED,
      });
      prismaMock.contract.update.mockResolvedValue({
        id: 'contract-1',
        status: ContractStatus.PENDING_APPROVAL,
      });

      const res = await contractsService.submitWork('free-1', 'contract-1');
      expect(res.status).toBe(ContractStatus.PENDING_APPROVAL);
    });

    it('should calculate platform fee deduction and payout net amount to freelancer on approval', async () => {
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'contract-1',
        jobId: 'job-1',
        clientId: 'client-1',
        freelancerId: 'free-1',
        escrowAmount: 1000,
        platformFee: 100,
        status: ContractStatus.PENDING_APPROVAL,
      });
      prismaMock.contract.update.mockResolvedValue({
        id: 'contract-1',
        status: ContractStatus.COMPLETED,
      });

      const res = await contractsService.approveWork('client-1', 'contract-1');

      expect(res.status).toBe(ContractStatus.COMPLETED);
      // Net payout = 1000 - 100 = 900
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'free-1' },
        data: { walletBalance: { increment: 900 } },
      });
      expect(prismaMock.freelancerProfile.update).toHaveBeenCalledWith({
        where: { userId: 'free-1' },
        data: { earnings: { increment: 900 }, totalProjects: { increment: 1 } },
      });
      expect(prismaMock.clientProfile.update).toHaveBeenCalledWith({
        where: { userId: 'client-1' },
        data: { totalSpent: { increment: 1000 } },
      });
      expect(prismaMock.job.update).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        data: { status: JobStatus.COMPLETED },
      });
    });
  });

  describe('disputeContract', () => {
    it('should set status to DISPUTED when called by participant', async () => {
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'contract-1',
        clientId: 'client-1',
        freelancerId: 'free-1',
        status: ContractStatus.FUNDED,
      });
      prismaMock.contract.update.mockResolvedValue({
        id: 'contract-1',
        status: ContractStatus.DISPUTED,
      });

      const res = await contractsService.disputeContract('free-1', 'contract-1');
      expect(res.status).toBe(ContractStatus.DISPUTED);
    });
  });
});
