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
import { CreateEducationDto } from '../dto/create-education.dto.js';
import { UpdateEducationDto } from '../dto/update-education.dto.js';
import { EducationService } from '../services/education.service.js';

@Roles(Role.FREELANCER)
@Controller('users/me/education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async getMyEducations(@CurrentUser('id') userId: string) {
    return this.educationService.getMyEducations(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addEducation(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateEducationDto,
  ) {
    return this.educationService.addEducation(userId, dto);
  }

  @Patch(':id')
  async updateEducation(
    @CurrentUser('id') userId: string,
    @Param('id') educationId: string,
    @Body() dto: UpdateEducationDto,
  ) {
    return this.educationService.updateEducation(userId, educationId, dto);
  }

  @Delete(':id')
  async deleteEducation(
    @CurrentUser('id') userId: string,
    @Param('id') educationId: string,
  ) {
    return this.educationService.deleteEducation(userId, educationId);
  }
}
