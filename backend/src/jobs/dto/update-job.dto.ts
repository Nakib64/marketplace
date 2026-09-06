import { PartialType } from '@nestjs/mapped-types';
import { JobStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateJobDto } from './create-job.dto.js';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsOptional()
  @IsEnum(JobStatus, { message: 'Invalid job status value.' })
  status?: JobStatus;
}
