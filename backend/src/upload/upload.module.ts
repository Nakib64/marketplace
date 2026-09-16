import { Module } from '@nestjs/common';
import { UploadController } from './controllers/upload.controller.js';
import { UploadService } from './services/upload.service.js';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
