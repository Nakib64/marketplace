import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { UploadImageQueryDto } from '../dto/upload-image.dto.js';
import type {
  UploadedFilePayload,
  UploadResult,
} from '../interfaces/uploaded-file.interface.js';
import { UploadService } from '../services/upload.service.js';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Upload an image file with optional target folder categorization
   * (e.g. ?folder=portfolio, ?folder=certificates, ?folder=avatars, ?folder=media)
   */
  @Post('image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @CurrentUser('id') _userId: string,
    @UploadedFile() file: UploadedFilePayload,
    @Query() query: UploadImageQueryDto,
  ): Promise<UploadResult> {
    return this.uploadService.saveImage(file, query.folder || 'media');
  }
}
