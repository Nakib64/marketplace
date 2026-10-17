import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AdminCmsController } from './controllers/admin-cms.controller.js';
import { PublicCmsController } from './controllers/public-cms.controller.js';
import { CmsService } from './services/cms.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [AdminCmsController, PublicCmsController],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
