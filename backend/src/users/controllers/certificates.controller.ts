import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CreateCertificateDto } from '../dto/create-certificate.dto.js';
import { UpdateCertificateDto } from '../dto/update-certificate.dto.js';
import { CertificatesService } from '../services/certificates.service.js';

@Roles(Role.FREELANCER)
@Controller('users/me/certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  async getMyCertificates(@CurrentUser('id') userId: string) {
    return this.certificatesService.getMyCertificates(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addCertificate(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCertificateDto,
  ) {
    return this.certificatesService.addCertificate(userId, dto);
  }

  @Patch(':id')
  async updateCertificate(
    @CurrentUser('id') userId: string,
    @Param('id') certificateId: string,
    @Body() dto: UpdateCertificateDto,
  ) {
    return this.certificatesService.updateCertificate(userId, certificateId, dto);
  }

  @Delete(':id')
  async deleteCertificate(
    @CurrentUser('id') userId: string,
    @Param('id') certificateId: string,
  ) {
    return this.certificatesService.deleteCertificate(userId, certificateId);
  }
}
