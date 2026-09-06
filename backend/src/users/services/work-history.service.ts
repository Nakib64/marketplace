import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateWorkHistoryDto } from '../dto/create-work-history.dto.js';
import { UpdateWorkHistoryDto } from '../dto/update-work-history.dto.js';

@Injectable()
export class WorkHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async addWorkHistory(userId: string, dto: CreateWorkHistoryDto) {
    return this.prisma.workHistory.create({
      data: {
        userId,
        title: dto.title,
        company: dto.company,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isCurrent: dto.isCurrent ?? false,
      },
    });
  }

  async updateWorkHistory(userId: string, workHistoryId: string, dto: UpdateWorkHistoryDto) {
    const workHistory = await this.prisma.workHistory.findUnique({
      where: { id: workHistoryId },
    });

    if (!workHistory) {
      throw new NotFoundException('Work history entry not found.');
    }

    if (workHistory.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this work history.');
    }

    return this.prisma.workHistory.update({
      where: { id: workHistoryId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.company && { company: dto.company }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate !== undefined && {
          endDate: dto.endDate ? new Date(dto.endDate) : null,
        }),
        ...(dto.isCurrent !== undefined && { isCurrent: dto.isCurrent }),
      },
    });
  }

  async deleteWorkHistory(userId: string, workHistoryId: string) {
    const workHistory = await this.prisma.workHistory.findUnique({
      where: { id: workHistoryId },
    });

    if (!workHistory) {
      throw new NotFoundException('Work history entry not found.');
    }

    if (workHistory.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this work history.');
    }

    await this.prisma.workHistory.delete({
      where: { id: workHistoryId },
    });

    return { message: 'Work history entry deleted successfully.' };
  }
}
