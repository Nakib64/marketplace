import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { UpdateHomepageCmsDto } from '../dto/update-homepage-cms.dto.js';
import { CmsService } from '../services/cms.service.js';

@Roles(Role.ADMIN)
@Controller('admin/cms')
export class AdminCmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('homepage')
  async getHomepageCms() {
    return this.cmsService.getHomepageCms();
  }

  @Patch('homepage')
  async updateHomepageCms(@Body() dto: UpdateHomepageCmsDto) {
    return this.cmsService.updateHomepageCms(dto);
  }
}
