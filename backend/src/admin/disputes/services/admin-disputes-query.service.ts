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

  /**
   * Compiles complete evidentiary dossier:
   * - Contract financial details & milestones
   * - Client & Freelancer profiles
   * - Original Job and Proposal scope
   * - Chronological Workroom Chat conversation transcript with attachments
   */
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
        proposal: {
          select: {
            id: true,
            bidAmount: true,
            coverLetter: true,
            createdAt: true,
          },
        },
        refund: true,
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract dispute record not found.');
    }

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        jobId: contract.jobId,
        OR: [
          { clientId: contract.clientId, freelancerId: contract.freelancerId },
          { proposalId: contract.proposalId },
        ],
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 150,
          include: {
            sender: {
              select: { id: true, email: true, role: true },
            },
            attachments: true,
          },
        },
      },
    });

    return {
      ...contract,
      conversation,
    };
  }
}
