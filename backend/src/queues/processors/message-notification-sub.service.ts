import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';

@Injectable()
export class MessageNotificationSubService {
  private readonly logger = new Logger(MessageNotificationSubService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Dispatches offline message notifications and caches conversation activity in Redis.
   */
  async notifyAndTrackActivity(
    conversationId: string,
    senderId: string,
    recipientId: string,
    messageType: string,
    timestamp: string,
  ): Promise<void> {
    const [sender, recipient] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: senderId },
        select: { id: true, email: true, role: true },
      }),
      this.prisma.user.findUnique({
        where: { id: recipientId },
        select: { id: true, email: true, role: true },
      }),
    ]);

    if (recipient && sender) {
      this.logger.log(
        `[Offline Alert] Notification dispatched to [${recipient.email}]: New ${messageType.toLowerCase()} message from [${sender.email}] in conversation [${conversationId}]`,
      );
    }

    await this.redis.set(
      `conversation:${conversationId}:last_activity`,
      timestamp,
      86400,
    );
  }
}
