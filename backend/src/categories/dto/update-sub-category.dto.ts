import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCategoryDto } from './create-sub-category.dto.js';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {}
