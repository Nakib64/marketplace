import { Injectable, Logger } from '@nestjs/common';
import { AntiCircumventionService } from '../../admin/moderation/services/anti-circumvention.service.js';
import { AuditLoggerService } from '../../admin/audit/services/audit-logger.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ProposalModerationSubService {
  private readonly logger = new Logger(ProposalModerationSubService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly antiCircumvention: AntiCircumventionService,
    private readonly auditLogger: AuditLoggerService,
  ) {}

  /**
   * Scans proposal cover letter for contact sharing and auto-flags if violations are detected.
   */
  async scanAndModerate(proposalId: string, coverLetter?: string): Promise<boolean> {
    if (!coverLetter) return false;

    const scan = this.antiCircumvention.scanContent(coverLetter);
    if (!scan.isFlagged) return false;

    await this.prisma.proposal.update({
      where: { id: proposalId },
      data: {
        isFlagged: true,
        flagReason: scan.reasons.join('; '),
      },
    });

    await this.auditLogger.logAction({
      adminId: 'SYSTEM',
      action: 'PROPOSAL_AUTO_FLAGGED',
      targetType: 'PROPOSAL',
      targetId: proposalId,
      details: `Anti-circumvention flagged cover letter: ${scan.reasons.join('; ')}`,
    });

    this.logger.warn(`Proposal [${proposalId}] auto-flagged for circumvention violations.`);
    return true;
  }
}
