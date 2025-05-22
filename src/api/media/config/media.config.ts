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
}

export default registerAs<MediaConfig>('media', () => {
  console.info(`Register MediaConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    driver:
      (process.env.FILE_DRIVER as FileDriver | undefined) ?? FileDriver.LOCAL,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
    awsS3Region: process.env.AWS_S3_REGION,
    maxFileSize: 5242880, // 5mb
  };
});
