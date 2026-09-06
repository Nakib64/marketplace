import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';

@Injectable()
export class ProposalNotificationSubService {
  private readonly logger = new Logger(ProposalNotificationSubService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Dispatches client notification and updates active proposal count in Redis.
   */
  async notifyClientOnProposal(jobId: string, bidAmount?: number): Promise<void> {
    const jobRecord = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        client: { select: { id: true, email: true } },
      },
    });

    if (!jobRecord) return;

    this.logger.log(
      `[Notification Dispatch] Client [${jobRecord.client.email}] notified: New proposal received for job "${jobRecord.title}" (Bid: $${bidAmount || 0})`,
    );

    const proposalCount = await this.prisma.proposal.count({
      where: { jobId },
    });

    await this.redis.set(
      `job:${jobId}:proposals_count`,
      proposalCount.toString(),
      3600,
    );
  }

  /**
   * Dispatches notification to freelancer when proposal status changes.
   */
  async notifyFreelancerOnStatusChange(proposalId: string, newStatus?: string): Promise<void> {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        freelancer: { select: { id: true, email: true } },
        job: { select: { id: true, title: true } },
      },
    });

    if (!proposal) return;

    this.logger.log(
      `[Notification Dispatch] Freelancer [${proposal.freelancer.email}] notified: Proposal on "${proposal.job.title}" status changed to ${newStatus || proposal.status}`,
    );
  }
}
