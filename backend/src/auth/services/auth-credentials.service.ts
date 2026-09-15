import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomInt, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';
import { MailService } from '../../mail/mail.service.js';
import { LoginDto } from '../dto/login.dto.js';
import { RegisterDto } from '../dto/register.dto.js';

// Unambiguous 30-character uppercase alphabet (excluding confusing characters: 0, O, 1, I)
const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const CODE_LENGTH = 6;
const CODE_TTL_SECONDS = 600; // 10 minutes
const MAX_VERIFICATION_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60; // 60s cooldown between requests
const MAX_HOURLY_RESENDS = 5;

@Injectable()
export class AuthCredentialsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Generates a cryptographically random 6-character alphanumeric verification code.
   */
  private generateVerificationCode(): string {
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
      const randomIndex = randomInt(0, CODE_ALPHABET.length);
      code += CODE_ALPHABET[randomIndex];
    }
    return code;
  }

  /**
   * Compares two strings in constant-time to prevent side-channel timing attacks.
   */
  private timingSafeCompare(a: string, b: string): boolean {
    const normA = a.trim().toUpperCase();
    const normB = b.trim().toUpperCase();
    const bufA = Buffer.from(normA);
    const bufB = Buffer.from(normB);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  }

  /**
   * Registers a new user with bcrypt-hashed password, initializes profile,
   * generates a secure alphanumeric code, and sends a verification email.
   */
  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email address already exists.');
    }

    if (dto.role !== Role.CLIENT && dto.role !== Role.FREELANCER) {
      throw new ConflictException('Invalid role. Only CLIENT and FREELANCER registrations are permitted.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const createdUser = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
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

      const emailPrefix = normalizedEmail.split('@')[0].replace(/[^a-z0-9]/g, '').slice(0, 15) || 'user';
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      const profileSlug = `${emailPrefix}-${randomSuffix}`;

      if (dto.role === Role.CLIENT) {
        await tx.clientProfile.create({
          data: { userId: user.id, slug: profileSlug },
        });
      } else if (dto.role === Role.FREELANCER) {
        await tx.freelancerProfile.create({
          data: { userId: user.id, slug: profileSlug },
        });
      }

      return user;
    });

    // Generate secure 6-character alphanumeric code & store in Redis
    const code = this.generateVerificationCode();
    await this.redis.set(`email:verify:code:${normalizedEmail}`, code, CODE_TTL_SECONDS);
    await this.redis.del(`email:verify:attempts:${normalizedEmail}`);
    await this.redis.set(`email:verify:cooldown:${normalizedEmail}`, '1', RESEND_COOLDOWN_SECONDS);

    // Dispatch verification email
    await this.mailService.sendVerificationEmail(createdUser.email, code);

    return {
      message: 'Registration successful. A verification code has been sent to your email.',
      user: createdUser,
    };
  }

  /**
   * Validates login credentials and checks for account suspension.
   */
  async validateCredentials(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
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
   * Verifies the user's email address by validating the submitted alphanumeric code against Redis.
   * Enforces brute-force lockout after 5 consecutive failed attempts.
   */
  async verifyEmail(identifier: { userId?: string; email?: string }, code?: string) {
    const user = identifier.userId
      ? await this.prisma.user.findUnique({ where: { id: identifier.userId } })
      : identifier.email
        ? await this.prisma.user.findUnique({ where: { email: identifier.email.toLowerCase().trim() } })
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

    if (!code || typeof code !== 'string' || !code.trim()) {
      throw new BadRequestException('Verification code is required.');
    }

    const normalizedEmail = user.email.toLowerCase().trim();
    const attemptsKey = `email:verify:attempts:${normalizedEmail}`;
    const codeKey = `email:verify:code:${normalizedEmail}`;

    // Check failed attempt count
    const attemptsStr = await this.redis.get(attemptsKey);
    let attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;

    if (attempts >= MAX_VERIFICATION_ATTEMPTS) {
      await this.redis.del(codeKey);
      throw new BadRequestException(
        'Too many failed attempts. For your security, this verification code has been invalidated. Please request a new one.',
      );
    }

    // Retrieve active code from Redis
    const storedCode = await this.redis.get(codeKey);
    if (!storedCode) {
      throw new BadRequestException(
        'Verification code has expired or does not exist. Please request a new code.',
      );
    }

    // Constant-time comparison
    const isValid = this.timingSafeCompare(code, storedCode);

    if (!isValid) {
      attempts += 1;
      await this.redis.set(attemptsKey, attempts.toString(), CODE_TTL_SECONDS);
      const remainingAttempts = MAX_VERIFICATION_ATTEMPTS - attempts;

      if (remainingAttempts <= 0) {
        await this.redis.del(codeKey);
        throw new BadRequestException(
          'Too many failed attempts. This verification code has been invalidated. Please request a new code.',
        );
      }

      throw new BadRequestException(
        `Invalid verification code. ${remainingAttempts} attempt(s) remaining.`,
      );
    }

    // Verification successful: cleanup Redis keys and update database
    await this.redis.del(codeKey);
    await this.redis.del(attemptsKey);
    await this.redis.del(`email:verify:cooldown:${normalizedEmail}`);

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
   * Resends a newly generated alphanumeric verification code with cooldown and hourly limit checks.
   */
  async resendVerification(identifier: { userId?: string; email?: string }) {
    const user = identifier.userId
      ? await this.prisma.user.findUnique({ where: { id: identifier.userId } })
      : identifier.email
        ? await this.prisma.user.findUnique({ where: { email: identifier.email.toLowerCase().trim() } })
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

    const normalizedEmail = user.email.toLowerCase().trim();
    const cooldownKey = `email:verify:cooldown:${normalizedEmail}`;
    const hourlyKey = `email:verify:hourly:${normalizedEmail}`;

    // 1. Check 60-second cooldown
    const inCooldown = await this.redis.get(cooldownKey);
    if (inCooldown) {
      throw new HttpException(
        'Please wait 60 seconds before requesting another verification code.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 2. Check hourly frequency limit
    const hourlyCountStr = await this.redis.get(hourlyKey);
    const hourlyCount = hourlyCountStr ? parseInt(hourlyCountStr, 10) : 0;
    if (hourlyCount >= MAX_HOURLY_RESENDS) {
      throw new HttpException(
        'Hourly verification limit reached. Please check your inbox or try again in an hour.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 3. Generate new code and store in Redis
    const code = this.generateVerificationCode();
    await this.redis.set(`email:verify:code:${normalizedEmail}`, code, CODE_TTL_SECONDS);
    await this.redis.del(`email:verify:attempts:${normalizedEmail}`);
    await this.redis.set(cooldownKey, '1', RESEND_COOLDOWN_SECONDS);
    await this.redis.set(hourlyKey, (hourlyCount + 1).toString(), 3600);

    // 4. Dispatch email
    await this.mailService.sendVerificationEmail(user.email, code);

    return {
      message: `A new 6-character verification code has been sent to ${user.email}.`,
    };
  }
}
