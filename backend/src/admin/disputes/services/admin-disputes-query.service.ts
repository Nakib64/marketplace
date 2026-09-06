import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service.js';

@Injectable()
export class AdminDisputesQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async getDisputes() {
    return this.prisma.contract.findMany({
      where: { status: ContractStatus.DISPUTED },
      include: {
        client: { select: { id: true, email: true } },
        freelancer: { select: { id: true, email: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getDisputeDossier(contractId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            clientProfile: { select: { companyName: true, totalSpent: true, rating: true } },
          },
        },
        freelancer: {
          select: {
            id: true,
            email: true,
            freelancerProfile: { select: { title: true, earnings: true, rating: true, successRate: true } },
          },
        },
        job: true,
        refund: true,
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract dispute record not found.');
    }

    return contract;
  }
}
