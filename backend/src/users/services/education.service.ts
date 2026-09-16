import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateEducationDto } from '../dto/create-education.dto.js';
import { UpdateEducationDto } from '../dto/update-education.dto.js';

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyEducations(userId: string) {
    const freelancerProfile = await this.prisma.freelancerProfile.findUnique({
      where: { userId },
    });

    if (!freelancerProfile) {
      return [];
    }

    return this.prisma.education.findMany({
      where: { freelancerProfileId: freelancerProfile.id },
      orderBy: { startDate: 'desc' },
    });
  }

  async addEducation(userId: string, dto: CreateEducationDto) {
    const freelancerProfile = await this.prisma.freelancerProfile.findUnique({
      where: { userId },
    });

    if (!freelancerProfile) {
      throw new NotFoundException('Only users with a Freelancer profile can add education entries.');
    }

    return this.prisma.education.create({
      data: {
        freelancerProfileId: freelancerProfile.id,
        institution: dto.institution,
        degree: dto.degree,
        fieldOfStudy: dto.fieldOfStudy,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isCurrent: dto.isCurrent ?? false,
        description: dto.description,
      },
    });
  }

  async updateEducation(
    userId: string,
    educationId: string,
    dto: UpdateEducationDto,
  ) {
    const education = await this.prisma.education.findUnique({
      where: { id: educationId },
      include: { freelancerProfile: true },
    });

    if (!education) {
      throw new NotFoundException('Education entry not found.');
    }

    if (education.freelancerProfile.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this education entry.');
    }

    return this.prisma.education.update({
      where: { id: educationId },
      data: {
        ...(dto.institution && { institution: dto.institution }),
        ...(dto.degree && { degree: dto.degree }),
        ...(dto.fieldOfStudy !== undefined && { fieldOfStudy: dto.fieldOfStudy }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate !== undefined && {
          endDate: dto.endDate ? new Date(dto.endDate) : null,
        }),
        ...(dto.isCurrent !== undefined && { isCurrent: dto.isCurrent }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });
  }

  async deleteEducation(userId: string, educationId: string) {
    const education = await this.prisma.education.findUnique({
      where: { id: educationId },
      include: { freelancerProfile: true },
    });

    if (!education) {
      throw new NotFoundException('Education entry not found.');
    }

    if (education.freelancerProfile.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this education entry.');
    }

    await this.prisma.education.delete({
      where: { id: educationId },
    });

    return { message: 'Education entry deleted successfully.' };
  }
}
