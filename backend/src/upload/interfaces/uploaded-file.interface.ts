export interface UploadedFilePayload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export type UploadFolder =
  | 'portfolio'
  | 'certificates'
  | 'avatars'
  | 'chat'
  | 'media';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
  folder: UploadFolder;
}
