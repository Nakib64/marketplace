import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkHistoryDto } from './create-work-history.dto.js';

export class UpdateWorkHistoryDto extends PartialType(CreateWorkHistoryDto) {}
