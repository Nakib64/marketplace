import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator.js';
import { CategoriesService } from '../services/categories.service.js';
import { SkillsService } from '../services/skills.service.js';

@Public()
@Controller()
export class PublicCategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly skillsService: SkillsService,
  ) {}

  @Get('categories')
  async getCategories() {
    return this.categoriesService.getCategories(false);
  }

  @Get('skills')
  async getSkills(@Query('q') search?: string) {
    return this.skillsService.getSkills(false, search);
  }
}
