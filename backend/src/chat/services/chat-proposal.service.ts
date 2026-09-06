import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MessageType } from '@prisma/client';
import { AntiCircumventionService } from '../../admin/moderation/services/anti-circumvention.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisQueueService } from '../../queues/services/redis-queue.service.js';
import { MessageJobPayload } from '../../queues/types/message-job.types.js';
import { ReplyProposalDto } from '../dto/reply-proposal.dto.js';

@Injectable()
export class ChatProposalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly antiCircumventionService: AntiCircumventionService,
    private readonly redisQueue: RedisQueueService,
  ) {}

  /**
   * Client replies to a proposal, creating/opening the conversation thread and sending the initial message.
   */
  async replyToProposal(clientId: string, proposalId: string, dto: ReplyProposalDto) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        job: { select: { id: true, clientId: true, title: true } },
        freelancer: { select: { id: true, email: true } },
      },
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found.');
    }

    if (proposal.job.clientId !== clientId) {
      throw new ForbiddenException('Only the client who posted the job can reply to this proposal.');
    }

    const scanResult = this.antiCircumventionService.scanContent(dto.message);

    const result = await this.prisma.$transaction(async (tx) => {
      let conversation = await tx.conversation.findFirst({
        where: {
          jobId: proposal.jobId,
          freelancerId: proposal.freelancerId,
        },
      });

      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            jobId: proposal.jobId,
            proposalId,
            clientId,
            freelancerId: proposal.freelancerId,
            lastMessageText: dto.message,
            lastMessageAt: new Date(),
          },
        });
      } else {
        conversation = await tx.conversation.update({
          where: { id: conversation.id },
          data: {
            lastMessageText: dto.message,
            lastMessageAt: new Date(),
            proposalId: conversation.proposalId || proposalId,
          },
        });
      }

      const message = await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId: clientId,
          content: dto.message,
          messageType: MessageType.TEXT,
          isFlagged: scanResult.isFlagged,
          flagReason: scanResult.isFlagged ? scanResult.reasons.join('; ') : null,
        },
        include: {
          sender: { select: { id: true, email: true, role: true } },
          attachments: true,
        },
      });

      if (!proposal.isViewed) {
        await tx.proposal.update({
          where: { id: proposalId },
          data: { isViewed: true },
        });
      }

      return {
        conversation,
        message,
      };
    });

    await this.redisQueue.enqueue<MessageJobPayload>(
      RedisQueueService.MESSAGES_QUEUE,
      'PROPOSAL_REPLIED',
      {
        messageId: result.message.id,
        conversationId: result.conversation.id,
        senderId: clientId,
        recipientId: proposal.freelancerId,
        content: dto.message,
        messageType: MessageType.TEXT,
        timestamp: result.message?.createdAt
          ? new Date(result.message.createdAt).toISOString()
          : new Date().toISOString(),
      },
    );

    return result;
  }
}
