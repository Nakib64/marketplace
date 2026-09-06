import { ConflictException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoriesService } from './services/categories.service.js';
import { SkillsService } from './services/skills.service.js';

describe('Categories & Skills Sub-Services', () => {
  let categoriesService: CategoriesService;
  let skillsService: SkillsService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      category: {
        create: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      subCategory: {
        create: vi.fn(),
        findUnique: vi.fn(),
        delete: vi.fn(),
      },
      skill: {
        create: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    categoriesService = new CategoriesService(prismaMock);
    skillsService = new SkillsService(prismaMock);
  });

  describe('CategoriesService', () => {
    it('should create a category with auto-generated slug', async () => {
      prismaMock.category.findFirst.mockResolvedValue(null);
      prismaMock.category.create.mockResolvedValue({
        id: 'cat-1',
        name: 'Web Development',
        slug: 'web-development',
        isActive: true,
      });

      const result = await categoriesService.createCategory({
        name: 'Web Development',
      });

      expect(result.id).toBe('cat-1');
      expect(result.slug).toBe('web-development');
      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: {
          name: 'Web Development',
          slug: 'web-development',
          description: undefined,
          isActive: true,
        },
      });
    });

    it('should throw ConflictException if category name/slug exists', async () => {
      prismaMock.category.findFirst.mockResolvedValue({ id: 'existing-cat' });

      await expect(
        categoriesService.createCategory({ name: 'Web Development' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should add a sub-category under an existing category', async () => {
      prismaMock.category.findUnique.mockResolvedValue({ id: 'cat-1', name: 'Web Dev' });
      prismaMock.subCategory.create.mockResolvedValue({
        id: 'subcat-1',
        categoryId: 'cat-1',
        name: 'Frontend Development',
        slug: 'frontend-development',
      });

      const result = await categoriesService.addSubCategory('cat-1', {
        name: 'Frontend Development',
      });

      expect(result.id).toBe('subcat-1');
      expect(result.slug).toBe('frontend-development');
    });
  });

  describe('SkillsService', () => {
    it('should create a skill with auto-generated slug', async () => {
      prismaMock.skill.findFirst.mockResolvedValue(null);
      prismaMock.skill.create.mockResolvedValue({
        id: 'skill-1',
        name: 'TypeScript',
        slug: 'typescript',
        isActive: true,
      });

      const result = await skillsService.createSkill({ name: 'TypeScript' });
      expect(result.name).toBe('TypeScript');
      expect(result.slug).toBe('typescript');
    });

    it('should retrieve active skills list', async () => {
      prismaMock.skill.findMany.mockResolvedValue([
        { id: 's1', name: 'React', slug: 'react', isActive: true },
      ]);

      const skills = await skillsService.getSkills(false);
      expect(skills.length).toBe(1);
      expect(skills[0].name).toBe('React');
    });

    it('should throw NotFoundException if deleting non-existent skill', async () => {
      prismaMock.skill.findUnique.mockResolvedValue(null);

      await expect(skillsService.deleteSkill('invalid-skill')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
