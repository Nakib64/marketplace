import { Controller, Get } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator.js';
import { CmsService } from '../services/cms.service.js';

@Public()
@Controller('cms')
export class PublicCmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('homepage')
  async getHomepageCms() {
    return this.cmsService.getHomepageCms();
  }
}
