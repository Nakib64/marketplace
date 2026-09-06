import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AdminCategoriesController } from './controllers/admin-categories.controller.js';
import { AdminSkillsController } from './controllers/admin-skills.controller.js';
import { PublicCategoriesController } from './controllers/public-categories.controller.js';
import { CategoriesService } from './services/categories.service.js';
import { SkillsService } from './services/skills.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [
    AdminCategoriesController,
    AdminSkillsController,
    PublicCategoriesController,
  ],
  providers: [CategoriesService, SkillsService],
  exports: [CategoriesService, SkillsService],
})
export class CategoriesModule {}
