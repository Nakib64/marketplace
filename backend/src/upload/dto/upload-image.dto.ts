import { IsEnum, IsOptional } from 'class-validator';
import * as uploadedFileInterface from '../interfaces/uploaded-file.interface.js';

export class UploadImageQueryDto {
  @IsOptional()
  @IsEnum(['portfolio', 'certificates', 'avatars', 'chat', 'media'] as const, {
    message: 'folder must be one of: portfolio, certificates, avatars, chat, media',
  })
  folder?: uploadedFileInterface.UploadFolder = 'media';
}
