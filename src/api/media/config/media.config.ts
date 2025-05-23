import validateConfig from '@/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FileDriver, MediaConfig } from './media-config.type';

class EnvironmentVariablesValidator {
  @IsEnum(FileDriver)
  @IsNotEmpty()
  FILE_DRIVER: FileDriver;

  @IsString()
  ACCESS_KEY_ID: string;

  @IsString()
  AWS_DEFAULT_S3_BUCKET: string;

  @IsString()
  AWS_S3_REGION: string;

  @IsString()
  CLOUDINARY_CLOUD_NAME: string;

  @IsString()
  CLOUDINARY_API_KEY: string;

  @IsString()
  CLOUDINARY_API_SECRET: string;

  @IsString()
  LOCAL_UPLOAD_PATH: string;
}

export default registerAs<MediaConfig>('media', () => {
  console.info(`Register MediaConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  const port = 3000;
  return {
    driver:
      (process.env.FILE_DRIVER as FileDriver | undefined) ??
      FileDriver.CLOUDINARY,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
    awsS3Region: process.env.AWS_S3_REGION,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    maxFileSize: 5242880, // 5mb
    uploadPath: process.env.LOCAL_UPLOAD_PATH || './uploads',
    baseUrl: process.env.APP_URL || `http://localhost:${port}`,
  };
});
