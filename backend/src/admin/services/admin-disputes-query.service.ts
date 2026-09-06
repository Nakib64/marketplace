import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AdminDisputesQueryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lists all contracts currently in DISPUTED status.
   */
  async getDisputes() {
    return await this.prisma.contract.findMany({
      where: { status: ContractStatus.DISPUTED },
      include: {
        job: { select: { id: true, title: true, status: true } },
        client: { select: { id: true, email: true } },
        freelancer: { select: { id: true, email: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Retrieves comprehensive arbitration dossier for a contract.
   */
  async getDisputeDossier(contractId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        job: {
          include: {
            category: { select: { name: true } },
            subCategory: { select: { name: true } },
          },
        },
        proposal: true,
        client: {
          select: {
            id: true,
            email: true,
            clientProfile: true,
          },
        },
        freelancer: {
          select: {
            id: true,
            email: true,
            freelancerProfile: true,
          },
        },
        reviews: true,
      },
    });

    if (!contract) {
      throw new NotFoundException('Disputed contract not found.');
    }

    return contract;
  }
}
