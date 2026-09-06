import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { CreateWorkHistoryDto } from '../dto/create-work-history.dto.js';
import { UpdateWorkHistoryDto } from '../dto/update-work-history.dto.js';
import { WorkHistoryService } from '../services/work-history.service.js';

@Controller('users/me/work-history')
export class WorkHistoryController {
  constructor(private readonly workHistoryService: WorkHistoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addWorkHistory(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateWorkHistoryDto,
  ) {
    return this.workHistoryService.addWorkHistory(userId, dto);
  }

  @Patch(':id')
  async updateWorkHistory(
    @CurrentUser('id') userId: string,
    @Param('id') workHistoryId: string,
    @Body() dto: UpdateWorkHistoryDto,
  ) {
    return this.workHistoryService.updateWorkHistory(userId, workHistoryId, dto);
  }

  @Delete(':id')
  async deleteWorkHistory(
    @CurrentUser('id') userId: string,
    @Param('id') workHistoryId: string,
  ) {
    return this.workHistoryService.deleteWorkHistory(userId, workHistoryId);
  }
}
