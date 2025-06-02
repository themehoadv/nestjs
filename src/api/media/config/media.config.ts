import validateConfig from '@/utils/validate-config';
import { registerAs } from '@nestjs/config';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FileDriver, MediaConfig } from './media-config.type';

class EnvironmentVariablesValidator {
  @IsEnum(FileDriver)
  @IsNotEmpty()
  FILE_DRIVER: FileDriver;

  @IsString()
  CLOUDINARY_CLOUD_NAME: string;

  @IsString()
  CLOUDINARY_API_KEY: string;

  @IsString()
  CLOUDINARY_API_SECRET: string;
}

export default registerAs<MediaConfig>('media', () => {
  console.info(`Register MediaConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    driver:
      (process.env.FILE_DRIVER as FileDriver | undefined) ??
      FileDriver.CLOUDINARY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    maxFileSize: 5242880,
  };
});
