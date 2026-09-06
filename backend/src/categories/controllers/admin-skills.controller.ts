import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CreateSkillDto } from '../dto/create-skill.dto.js';
import { UpdateSkillDto } from '../dto/update-skill.dto.js';
import { SkillsService } from '../services/skills.service.js';

@Roles(Role.ADMIN)
@Controller('admin/skills')
export class AdminSkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async getSkills(@Query('q') search?: string) {
    return this.skillsService.getSkills(true, search);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSkill(@Body() dto: CreateSkillDto) {
    return this.skillsService.createSkill(dto);
  }

  @Patch(':id')
  async updateSkill(@Param('id') id: string, @Body() dto: UpdateSkillDto) {
    return this.skillsService.updateSkill(id, dto);
  }

  @Delete(':id')
  async deleteSkill(@Param('id') id: string) {
    return this.skillsService.deleteSkill(id);
  }
}
