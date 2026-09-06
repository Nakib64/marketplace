import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateCategoryDto } from '../dto/create-category.dto.js';
import { CreateSubCategoryDto } from '../dto/create-sub-category.dto.js';
import { UpdateCategoryDto } from '../dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-');
  }

  async createCategory(dto: CreateCategoryDto) {
    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.name);
    const existing = await this.prisma.category.findFirst({
      where: { OR: [{ name: dto.name }, { slug }] },
    });

    if (existing) {
      throw new ConflictException('Category with this name or slug already exists.');
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async getCategories(includeInactive = false) {
    return this.prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        subCategories: {
          where: includeInactive ? {} : { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { subCategories: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    return category;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    await this.getCategoryById(id);
    const slug = dto.slug || (dto.name ? this.slugify(dto.name) : undefined);

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(slug && { slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  async deleteCategory(id: string) {
    await this.getCategoryById(id);
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully.' };
  }

  async addSubCategory(categoryId: string, dto: CreateSubCategoryDto) {
    await this.getCategoryById(categoryId);
    const slug = dto.slug ? this.slugify(dto.slug) : this.slugify(dto.name);

    return this.prisma.subCategory.create({
      data: {
        categoryId,
        name: dto.name,
        slug,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async deleteSubCategory(subCategoryId: string) {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id: subCategoryId },
    });

    if (!subCategory) {
      throw new NotFoundException('Sub-category not found.');
    }

    await this.prisma.subCategory.delete({ where: { id: subCategoryId } });
    return { message: 'Sub-category deleted successfully.' };
  }
}
