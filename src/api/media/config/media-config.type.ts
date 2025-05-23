export enum FileDriver {
  LOCAL = 'local',
  S3 = 's3',
  S3_PRESIGNED = 's3-presigned',
  CLOUDINARY = 'cloudinary',
}

export interface FileStorageService {
  upload(file: Express.Multer.File, folder?: string): Promise<any>;
  delete(filePath: string): Promise<void>;
}

export type MediaConfig = {
  driver: FileDriver;
  maxFileSize: number;
  accessKeyId?: string;
  secretAccessKey?: string;
  awsDefaultS3Bucket?: string;
  awsS3Region?: string;
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
  uploadPath?: string;
  baseUrl?: string;
};
