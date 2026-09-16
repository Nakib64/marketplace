import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import {
  UploadedFilePayload,
  UploadFolder,
  UploadResult,
} from '../interfaces/uploaded-file.interface.js';

@Injectable()
export class UploadService {
  private readonly uploadRoot = path.join(process.cwd(), 'uploads');
  private readonly maxImageSize = 10 * 1024 * 1024; // 10 MB

  private readonly allowedImageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ];

  private readonly allowedFolders: UploadFolder[] = [
    'portfolio',
    'certificates',
    'avatars',
    'chat',
    'media',
  ];

  constructor() {
    this.ensureFolderStructure();
  }

  private ensureFolderStructure() {
    for (const folder of this.allowedFolders) {
      const targetDir = path.join(this.uploadRoot, folder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
    }
  }

  getFolderPath(folder: UploadFolder): string {
    const safeFolder = this.allowedFolders.includes(folder) ? folder : 'media';
    const folderPath = path.join(this.uploadRoot, safeFolder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    return folderPath;
  }

  validateImage(file: UploadedFilePayload) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No image file provided.');
    }

    if (file.size > this.maxImageSize) {
      throw new BadRequestException('Image size exceeds maximum limit of 10MB.');
    }

    if (!this.allowedImageMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type "${file.mimetype}". Allowed image formats: JPEG, PNG, WebP, GIF, SVG.`,
      );
    }
  }

  async saveImage(
    file: UploadedFilePayload,
    folder: UploadFolder = 'media',
  ): Promise<UploadResult> {
    this.validateImage(file);

    const safeFolder: UploadFolder = this.allowedFolders.includes(folder)
      ? folder
      : 'media';
    const targetDir = this.getFolderPath(safeFolder);

    const safeBaseName = path
      .basename(file.originalname)
      .replace(/[^a-zA-Z0-9._-]/g, '_');
    const storedFileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeBaseName}`;
    const targetPath = path.join(targetDir, storedFileName);

    await fs.promises.writeFile(targetPath, file.buffer);

    return {
      url: `/uploads/${safeFolder}/${storedFileName}`,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      folder: safeFolder,
    };
  }

  async deleteFile(relativeUrl: string): Promise<boolean> {
    try {
      if (!relativeUrl.startsWith('/uploads/')) {
        return false;
      }
      const safeRelative = relativeUrl.replace(/^\/uploads\//, '');
      const absolutePath = path.join(this.uploadRoot, safeRelative);

      // Verify the path is within uploadRoot to prevent directory traversal
      if (!absolutePath.startsWith(this.uploadRoot)) {
        return false;
      }

      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
