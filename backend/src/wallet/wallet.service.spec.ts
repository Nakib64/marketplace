import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ContractStatus, JobStatus, WithdrawalMethod, WithdrawalStatus } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WalletService } from './services/wallet.service.js';

describe('WalletService', () => {
  let walletService: WalletService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      withdrawal: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      contract: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      job: {
        update: vi.fn(),
      },
      refund: {
        findMany: vi.fn(),
        create: vi.fn(),
      },
      $transaction: vi.fn((cb) => cb(prismaMock)),
    };

    walletService = new WalletService(prismaMock);
  });

  describe('getWalletBalance', () => {
    it('should throw NotFoundException if user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(walletService.getWalletBalance('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return user balance, withdrawals, and refunds', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@test.com',
        walletBalance: 1250.5,
      });
      prismaMock.withdrawal.findMany.mockResolvedValue([
        { id: 'w-1', amount: 500, status: WithdrawalStatus.APPROVED },
      ]);
      prismaMock.refund.findMany.mockResolvedValue([]);

      const res = await walletService.getWalletBalance('user-1');

      expect(res.walletBalance).toBe(1250.5);
      expect(res.withdrawals).toHaveLength(1);
      expect(res.refunds).toHaveLength(0);
    });
  });

  describe('requestWithdrawal', () => {
    it('should throw BadRequestException if balance is insufficient', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'free-1',
        walletBalance: 300,
      });

      await expect(
        walletService.requestWithdrawal('free-1', {
          amount: 500,
          method: WithdrawalMethod.BKASH,
          accountNumber: '01711223344',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should deduct balance and create PENDING withdrawal successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'free-1',
        walletBalance: 1000,
      });
      prismaMock.withdrawal.create.mockResolvedValue({
        id: 'w-1',
        freelancerId: 'free-1',
        amount: 500,
        method: WithdrawalMethod.BKASH,
        accountNumber: '01711223344',
        status: WithdrawalStatus.PENDING,
      });

      const res = await walletService.requestWithdrawal('free-1', {
        amount: 500,
        method: WithdrawalMethod.BKASH,
        accountNumber: '01711223344',
      });

      expect(res.withdrawal.status).toBe(WithdrawalStatus.PENDING);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'free-1' },
        data: { walletBalance: { decrement: 500 } },
      });
    });
  });

  describe('approveWithdrawal & rejectWithdrawal', () => {
    it('should approve a pending withdrawal', async () => {
      prismaMock.withdrawal.findUnique.mockResolvedValue({
        id: 'w-1',
        status: WithdrawalStatus.PENDING,
      });
      prismaMock.withdrawal.update.mockResolvedValue({
        id: 'w-1',
        status: WithdrawalStatus.APPROVED,
      });

      const res = await walletService.approveWithdrawal('w-1');
      expect(res.status).toBe(WithdrawalStatus.APPROVED);
    });

    it('should reject a pending withdrawal and refund balance back to freelancer', async () => {
      prismaMock.withdrawal.findUnique.mockResolvedValue({
        id: 'w-1',
        freelancerId: 'free-1',
        amount: 500,
        status: WithdrawalStatus.PENDING,
      });
      prismaMock.withdrawal.update.mockResolvedValue({
        id: 'w-1',
        status: WithdrawalStatus.REJECTED,
      });

      const res = await walletService.rejectWithdrawal('w-1');

      expect(res.withdrawal.status).toBe(WithdrawalStatus.REJECTED);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'free-1' },
        data: { walletBalance: { increment: 500 } },
      });
    });

    it('should throw BadRequestException when attempting to approve or reject a non-pending withdrawal', async () => {
      prismaMock.withdrawal.findUnique.mockResolvedValue({
        id: 'w-1',
        status: WithdrawalStatus.APPROVED,
      });

      await expect(walletService.approveWithdrawal('w-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(walletService.rejectWithdrawal('w-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('refundContract (Admin Project Cancellation & Refund)', () => {
    it('should throw BadRequestException if contract is already COMPLETED', async () => {
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'contract-1',
        status: ContractStatus.COMPLETED,
      });

      await expect(
        walletService.refundContract('admin-1', 'contract-1', {
          reason: 'Client requested cancellation',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if contract is already REFUNDED', async () => {
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'contract-1',
        status: ContractStatus.REFUNDED,
      });

      await expect(
        walletService.refundContract('admin-1', 'contract-1', {
          reason: 'Already refunded',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should refund escrow to client, cancel job, mark contract REFUNDED, and store Refund record', async () => {
      prismaMock.contract.findUnique.mockResolvedValue({
        id: 'contract-1',
        jobId: 'job-1',
        clientId: 'client-1',
        escrowAmount: 1500,
        status: ContractStatus.FUNDED,
      });
      prismaMock.contract.update.mockResolvedValue({
        id: 'contract-1',
        status: ContractStatus.REFUNDED,
      });
      prismaMock.refund.create.mockResolvedValue({
        id: 'refund-1',
        contractId: 'contract-1',
        clientId: 'client-1',
        amount: 1500,
        reason: 'Freelancer inactive',
        adminId: 'admin-1',
      });

      const res = await walletService.refundContract('admin-1', 'contract-1', {
        reason: 'Freelancer inactive',
      });

      expect(res.contract.status).toBe(ContractStatus.REFUNDED);
      expect(prismaMock.job.update).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        data: { status: JobStatus.CANCELED },
      });
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'client-1' },
        data: { walletBalance: { increment: 1500 } },
      });
      expect(prismaMock.refund.create).toHaveBeenCalledWith({
        data: {
          contractId: 'contract-1',
          clientId: 'client-1',
          amount: 1500,
          reason: 'Freelancer inactive',
          adminId: 'admin-1',
        },
      });
    });
  });
});
