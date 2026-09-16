import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateCertificateDto } from '../dto/create-certificate.dto.js';
import { UpdateCertificateDto } from '../dto/update-certificate.dto.js';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyCertificates(userId: string) {
    const freelancerProfile = await this.prisma.freelancerProfile.findUnique({
      where: { userId },
    });

    if (!freelancerProfile) {
      return [];
    }

    return this.prisma.certificate.findMany({
      where: { freelancerProfileId: freelancerProfile.id },
      orderBy: { issueDate: 'desc' },
    });
  }

  async addCertificate(userId: string, dto: CreateCertificateDto) {
    const freelancerProfile = await this.prisma.freelancerProfile.findUnique({
      where: { userId },
    });

    if (!freelancerProfile) {
      throw new NotFoundException('Only users with a Freelancer profile can add certificates.');
    }

    return this.prisma.certificate.create({
      data: {
        freelancerProfileId: freelancerProfile.id,
        title: dto.title,
        issuer: dto.issuer,
        issueDate: new Date(dto.issueDate),
        credentialUrl: dto.credentialUrl,
        imageUrl: dto.imageUrl,
      },
    });
  }

  async updateCertificate(
    userId: string,
    certificateId: string,
    dto: UpdateCertificateDto,
  ) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { freelancerProfile: true },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found.');
    }

    if (certificate.freelancerProfile.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this certificate.');
    }

    return this.prisma.certificate.update({
      where: { id: certificateId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.issuer && { issuer: dto.issuer }),
        ...(dto.issueDate && { issueDate: new Date(dto.issueDate) }),
        ...(dto.credentialUrl !== undefined && { credentialUrl: dto.credentialUrl }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
      },
    });
  }

  async deleteCertificate(userId: string, certificateId: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { freelancerProfile: true },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found.');
    }

    if (certificate.freelancerProfile.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this certificate.');
    }

    await this.prisma.certificate.delete({
      where: { id: certificateId },
    });

    return { message: 'Certificate deleted successfully.' };
  }
}
