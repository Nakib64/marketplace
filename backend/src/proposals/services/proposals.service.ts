import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisQueueService } from '../../queues/services/redis-queue.service.js';
import { ProposalJobPayload } from '../../queues/types/proposal-job.types.js';
import { CreateProposalDto } from '../dto/create-proposal.dto.js';
import { UpdateProposalDto } from '../dto/update-proposal.dto.js';

@Injectable()
export class ProposalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisQueue: RedisQueueService,
  ) {}

  async submitProposal(jobId: string, freelancerId: string, dto: CreateProposalDto) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.status !== JobStatus.OPEN) {
      throw new NotFoundException('Job not found or is no longer open for proposals.');
    }

    const existing = await this.prisma.proposal.findUnique({
      where: { jobId_freelancerId: { jobId, freelancerId } },
    });
    if (existing) {
      throw new ConflictException('You have already applied to this job post.');
    }

    if (dto.portfolioItemIds && dto.portfolioItemIds.length > 4) {
      throw new BadRequestException('Maximum 4 portfolio items can be attached to a proposal.');
    }

    const created = await this.prisma.proposal.create({
      data: {
        jobId,
        freelancerId,
        bidAmount: dto.bidAmount,
        coverLetter: dto.coverLetter,
        workHistoryIds: dto.workHistoryIds || [],
        portfolioItemIds: dto.portfolioItemIds || [],
      },
    });

    await this.redisQueue.enqueue<ProposalJobPayload>(
      RedisQueueService.PROPOSALS_QUEUE,
      'PROPOSAL_SUBMITTED',
      {
        proposalId: created.id,
        jobId,
        freelancerId,
        coverLetter: dto.coverLetter,
        bidAmount: Number(dto.bidAmount),
        timestamp: new Date().toISOString(),
      },
    );

    return created;
  }

  async updateProposal(proposalId: string, freelancerId: string, dto: UpdateProposalDto) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!proposal || proposal.freelancerId !== freelancerId) {
      throw new NotFoundException('Proposal not found.');
    }

    if (proposal.isViewed) {
      throw new ForbiddenException('Cannot edit proposal after it has been viewed by the client.');
    }

    if (dto.portfolioItemIds && dto.portfolioItemIds.length > 4) {
      throw new BadRequestException('Maximum 4 portfolio items can be attached to a proposal.');
    }

    const updated = await this.prisma.proposal.update({
      where: { id: proposalId },
      data: { ...dto },
    });

    await this.redisQueue.enqueue<ProposalJobPayload>(
      RedisQueueService.PROPOSALS_QUEUE,
      'PROPOSAL_UPDATED',
      {
        proposalId: updated.id,
        jobId: updated.jobId,
        freelancerId,
        coverLetter: dto.coverLetter,
        bidAmount: dto.bidAmount ? Number(dto.bidAmount) : undefined,
        timestamp: new Date().toISOString(),
      },
    );

    return updated;
  }

  async withdrawProposal(proposalId: string, freelancerId: string) {
    const proposal = await this.prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!proposal || proposal.freelancerId !== freelancerId) {
      throw new NotFoundException('Proposal not found.');
    }

    await this.prisma.proposal.delete({ where: { id: proposalId } });
    return { message: 'Proposal withdrawn successfully.' };
  }

  async getFreelancerProposals(freelancerId: string) {
    return this.prisma.proposal.findMany({
      where: { freelancerId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            status: true,
            categoryName: true,
            subCategoryName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
