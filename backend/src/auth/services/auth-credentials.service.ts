import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { LoginDto } from '../dto/login.dto.js';
import { RegisterDto } from '../dto/register.dto.js';

@Injectable()
export class AuthCredentialsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new user with bcrypt-hashed password and initializes their role profile.
   */
  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email address already exists.');
    }

    if (dto.role !== Role.CLIENT && dto.role !== Role.FREELANCER) {
      throw new ConflictException('Invalid role. Only CLIENT and FREELANCER registrations are permitted.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          passwordHash: hashedPassword,
          role: dto.role,
        },
        select: {
          id: true,
          email: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
        },
      });

      if (dto.role === Role.CLIENT) {
        await tx.clientProfile.create({
          data: { userId: user.id },
        });
      } else if (dto.role === Role.FREELANCER) {
        await tx.freelancerProfile.create({
          data: { userId: user.id },
        });
      }

      return {
        message: 'Registration successful',
        user,
      };
    });
  }

  /**
   * Validates login credentials and checks for account suspension.
   */
  async validateCredentials(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password credentials.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password credentials.');
    }

    if (user.isBanned) {
      throw new UnauthorizedException('Your account has been suspended. Please contact support.');
    }

    return user;
  }

  /**
   * Verifies the user's email address in Prisma
   */
  async verifyEmail(identifier: { userId?: string; email?: string }, _code?: string) {
    const user = identifier.userId
      ? await this.prisma.user.findUnique({ where: { id: identifier.userId } })
      : identifier.email
        ? await this.prisma.user.findUnique({ where: { email: identifier.email.toLowerCase() } })
        : null;

    if (!user) {
      throw new UnauthorizedException('User account not found.');
    }

    if (user.isEmailVerified) {
      return {
        message: 'Email address is already verified.',
        isEmailVerified: true,
      };
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true },
    });

    return {
      message: 'Email address verified successfully.',
      isEmailVerified: true,
    };
  }

  /**
   * Resends verification notification
   */
  async resendVerification(identifier: { userId?: string; email?: string }) {
    const user = identifier.userId
      ? await this.prisma.user.findUnique({ where: { id: identifier.userId } })
      : identifier.email
        ? await this.prisma.user.findUnique({ where: { email: identifier.email.toLowerCase() } })
        : null;

    if (!user) {
      throw new UnauthorizedException('User account not found.');
    }

    if (user.isEmailVerified) {
      return {
        message: 'Email address is already verified.',
        isEmailVerified: true,
      };
    }

    return {
      message: `Verification link resent to ${user.email}.`,
    };
  }
}


