import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export interface UploadedChatFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class ChatFileService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'chat');
  private readonly maxFileSize = 15 * 1024 * 1024; // 15 MB

  private readonly allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    // Archives
    'application/zip',
    'application/x-zip-compressed',
  ];

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  validateFile(file: UploadedChatFile) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File exceeds the maximum limit of 15MB');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type "${file.mimetype}" is not supported. Allowed formats: images, PDF, Word, Excel, TXT, ZIP.`,
      );
    }
  }

  async saveFile(file: UploadedChatFile): Promise<{
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }> {
    this.validateFile(file);

    const safeBaseName = path
      .basename(file.originalname)
      .replace(/[^a-zA-Z0-9._-]/g, '_');
    const storedFileName = `${Date.now()}-${crypto.randomUUID()}-${safeBaseName}`;
    const targetPath = path.join(this.uploadDir, storedFileName);

    await fs.promises.writeFile(targetPath, file.buffer);

    return {
      fileName: file.originalname,
      fileUrl: `/chat/attachments/${storedFileName}`,
      fileType: file.mimetype,
      fileSize: file.size,
    };
  }

  getFilePath(fileName: string): string {
    const safeName = path.basename(fileName);
    return path.join(this.uploadDir, safeName);
  }
}
