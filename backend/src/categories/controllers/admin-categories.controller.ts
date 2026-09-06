import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CreateCategoryDto } from '../dto/create-category.dto.js';
import { CreateSubCategoryDto } from '../dto/create-sub-category.dto.js';
import { UpdateCategoryDto } from '../dto/update-category.dto.js';
import { UpdateSubCategoryDto } from '../dto/update-sub-category.dto.js';
import { CategoriesService } from '../services/categories.service.js';

@Roles(Role.ADMIN)
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories() {
    return this.categoriesService.getCategories(true);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @Patch(':id')
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(id, dto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }

  @Post(':id/sub-categories')
  @HttpCode(HttpStatus.CREATED)
  async addSubCategory(
    @Param('id') categoryId: string,
    @Body() dto: CreateSubCategoryDto,
  ) {
    return this.categoriesService.addSubCategory(categoryId, dto);
  }

  @Patch('sub-categories/:subCategoryId')
  async updateSubCategory(
    @Param('subCategoryId') subCategoryId: string,
    @Body() dto: UpdateSubCategoryDto,
  ) {
    return this.categoriesService.updateSubCategory(subCategoryId, dto);
  }

  @Delete('sub-categories/:subCategoryId')
  async deleteSubCategory(@Param('subCategoryId') subCategoryId: string) {
    return this.categoriesService.deleteSubCategory(subCategoryId);
  }
}
