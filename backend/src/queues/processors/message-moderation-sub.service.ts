import { Injectable, Logger } from '@nestjs/common';
import { AntiCircumventionService } from '../../admin/moderation/services/anti-circumvention.service.js';
import { AuditLoggerService } from '../../admin/audit/services/audit-logger.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class MessageModerationSubService {
  private readonly logger = new Logger(MessageModerationSubService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly antiCircumvention: AntiCircumventionService,
    private readonly auditLogger: AuditLoggerService,
  ) {}

  /**
   * Scans message content for contact evasion and auto-flags if violations are found.
   */
  async scanAndModerate(messageId: string, content?: string): Promise<boolean> {
    if (!content) return false;

    const scan = this.antiCircumvention.scanContent(content);
    if (!scan.isFlagged) return false;

    const currentMessage = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (currentMessage && !currentMessage.isFlagged) {
      await this.prisma.message.update({
        where: { id: messageId },
        data: {
          isFlagged: true,
          flagReason: scan.reasons.join('; '),
        },
      });

      await this.auditLogger.logAction({
        adminId: 'SYSTEM',
        action: 'MESSAGE_AUTO_FLAGGED',
        targetType: 'MESSAGE',
        targetId: messageId,
        details: `Anti-circumvention detected contact sharing: ${scan.reasons.join('; ')}`,
      });

      this.logger.warn(`Message [${messageId}] auto-flagged for circumvention violations.`);
      return true;
    }

    return false;
  }
}
