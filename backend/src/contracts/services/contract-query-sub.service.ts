import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ContractQuerySubService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves single contract detail.
   */
  async getContract(userId: string, contractId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        job: true,
        client: { select: { id: true, email: true, clientProfile: true } },
        freelancer: { select: { id: true, email: true, freelancerProfile: true } },
        proposal: true,
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found.');
    }
    if (contract.clientId !== userId && contract.freelancerId !== userId) {
      throw new ForbiddenException('You are not authorized to view this contract.');
    }

    return contract;
  }

  /**
   * Retrieves list of user's active & past contracts.
   */
  async getUserContracts(userId: string) {
    return await this.prisma.contract.findMany({
      where: {
        OR: [{ clientId: userId }, { freelancerId: userId }],
      },
      include: {
        job: { select: { id: true, title: true, status: true } },
        client: { select: { id: true, email: true } },
        freelancer: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
