import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ClientProposalsService {
  constructor(private readonly prisma: PrismaService) {}

  async getJobProposals(jobId: string, clientId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job post not found.');
    }
    if (job.clientId !== clientId) {
      throw new ForbiddenException('You are not authorized to view proposals for this job post.');
    }

    const proposals = await this.prisma.proposal.findMany({
      where: { jobId },
      include: {
        freelancer: {
          select: {
            id: true,
            email: true,
            workHistories: true,
            freelancerProfile: {
              include: {
                portfolioItems: { include: { images: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const unviewedIds = proposals.filter((p) => !p.isViewed).map((p) => p.id);
    if (unviewedIds.length > 0) {
      await this.prisma.proposal.updateMany({
        where: { id: { in: unviewedIds } },
        data: { isViewed: true },
      });
    }

    return proposals;
  }
}
