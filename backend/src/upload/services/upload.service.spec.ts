import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { UploadedFilePayload } from '../interfaces/uploaded-file.interface.js';
import { UploadService } from './upload.service.js';

describe('UploadService', () => {
  let uploadService: UploadService;

  beforeEach(() => {
    uploadService = new UploadService();
  });

  afterAll(async () => {
    // Cleanup temporary test files if any
  });

  it('should reject empty or missing file', async () => {
    await expect(uploadService.saveImage(null as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should reject file that exceeds maximum size', async () => {
    const oversizedFile: UploadedFilePayload = {
      fieldname: 'file',
      originalname: 'huge.png',
      encoding: '7bit',
      mimetype: 'image/png',
      size: 11 * 1024 * 1024, // 11MB > 10MB limit
      buffer: Buffer.alloc(100),
    };

    await expect(uploadService.saveImage(oversizedFile)).rejects.toThrow(
      'Image size exceeds maximum limit of 10MB.',
    );
  });

  it('should reject unsupported MIME types (e.g. text/html, exe)', async () => {
    const invalidMimeFile: UploadedFilePayload = {
      fieldname: 'file',
      originalname: 'virus.exe',
      encoding: '7bit',
      mimetype: 'application/x-msdownload',
      size: 500,
      buffer: Buffer.from('fake binary content'),
    };

    await expect(uploadService.saveImage(invalidMimeFile)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should successfully save valid image to portfolio folder', async () => {
    const validImage: UploadedFilePayload = {
      fieldname: 'file',
      originalname: 'my-dapp-screenshot.png',
      encoding: '7bit',
      mimetype: 'image/png',
      size: 1024,
      buffer: Buffer.from('fake-image-bytes'),
    };

    const result = await uploadService.saveImage(validImage, 'portfolio');

    expect(result.filename).toBe('my-dapp-screenshot.png');
    expect(result.folder).toBe('portfolio');
    expect(result.mimetype).toBe('image/png');
    expect(result.url).toMatch(/^\/uploads\/portfolio\/\d+-[a-f0-9]+-my-dapp-screenshot\.png$/);

    // Clean up created test file
    await uploadService.deleteFile(result.url);
  });

  it('should successfully save valid image to certificates folder', async () => {
    const validImage: UploadedFilePayload = {
      fieldname: 'file',
      originalname: 'aws-badge.webp',
      encoding: '7bit',
      mimetype: 'image/webp',
      size: 2048,
      buffer: Buffer.from('fake-badge-bytes'),
    };

    const result = await uploadService.saveImage(validImage, 'certificates');

    expect(result.filename).toBe('aws-badge.webp');
    expect(result.folder).toBe('certificates');
    expect(result.url).toMatch(/^\/uploads\/certificates\/\d+-[a-f0-9]+-aws-badge\.webp$/);

    // Clean up created test file
    await uploadService.deleteFile(result.url);
  });
});
