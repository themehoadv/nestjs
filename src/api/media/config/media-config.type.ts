import { UploadApiResponse } from 'cloudinary';

export enum FileDriver {
  LOCAL = 'local',
  CLOUDINARY = 'cloudinary',
}

export interface FileStorageService {
  upload(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadApiResponse>;
}

export type MediaConfig = {
  driver: FileDriver;
  maxFileSize: number;
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
};
