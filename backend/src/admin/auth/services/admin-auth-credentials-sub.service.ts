import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { AdminLoginDto } from '../dto/admin-login.dto.js';

@Injectable()
export class AdminAuthCredentialsSubService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Validates staff credentials, checks account status, and updates last login timestamp.
   */
  async validateCredentials(dto: AdminLoginDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid staff credentials or account is inactive.');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Staff account has been deactivated. Please contact an administrator.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid staff credentials or account is inactive.');
    }

    // Update lastLoginAt timestamp
    await this.prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isActive: admin.isActive,
      twoFactorEnabled: admin.twoFactorEnabled,
    };
  }

  /**
   * Retrieves an admin by ID for profile or verification checks.
   */
  async getAdminProfile(adminId: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Staff member not found or account is deactivated.');
    }

    return admin;
  }
}
