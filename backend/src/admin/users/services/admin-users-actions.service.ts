import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { AuditLoggerService } from '../../audit/services/audit-logger.service.js';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto.js';

@Injectable()
export class AdminUsersActionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditLogger: AuditLoggerService,
  ) {}

  async updateUserStatus(adminId: string, targetUserId: string, dto: UpdateUserStatusDto) {
    if (adminId === targetUserId) {
      throw new BadRequestException('Administrators cannot sanction their own account.');
    }
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new NotFoundException('User not found.');

    const updatedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { isBanned: dto.isBanned },
      select: { id: true, email: true, role: true, isBanned: true },
    });

    await this.auditLogger.logAction({
      adminId,
      action: dto.isBanned ? 'USER_BANNED' : 'USER_UNBANNED',
      targetType: 'USER',
      targetId: targetUserId,
      details: dto.reason,
    });

    return {
      message: dto.isBanned ? 'User has been banned.' : 'User ban has been lifted.',
      user: updatedUser,
      reason: dto.reason,
    };
  }

  async verifyUserEmail(adminId: string, targetUserId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new NotFoundException('User not found.');

    const updatedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { isEmailVerified: true },
      select: { id: true, email: true, isEmailVerified: true },
    });

    await this.auditLogger.logAction({
      adminId,
      action: 'USER_VERIFIED',
      targetType: 'USER',
      targetId: targetUserId,
      details: 'Manual email verification',
    });

    return { message: 'User email has been manually verified.', user: updatedUser };
  }

  async generateImpersonationToken(adminId: string, targetUserId: string) {
    const targetUser = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) throw new NotFoundException('Target user for impersonation not found.');
    if (targetUser.role === Role.ADMIN) throw new BadRequestException('Cannot impersonate another administrator.');

    const payload = {
      sub: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
      isImpersonated: true,
      impersonatedBy: adminId,
    };

    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '1h' });

    await this.auditLogger.logAction({
      adminId,
      action: 'USER_IMPERSONATED',
      targetType: 'USER',
      targetId: targetUserId,
    });

    return {
      accessToken,
      impersonatedUser: { id: targetUser.id, email: targetUser.email, role: targetUser.role },
      expiresIn: '1h',
    };
  }
}
