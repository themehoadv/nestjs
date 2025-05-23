import { AllConfigType } from '@/config/config.type';
import {
  MAX_FILE_SIZE,
  SUPPORTED_DOCUMENT_EXTENSIONS,
  SUPPORTED_IMAGE_EXTENSIONS,
} from '@/constants/upload.constant';
import { UnprocessableEntityException } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import * as path from 'path';
import { normalize } from 'path';
// TODO: Refactor code
export class MediaUrlUtil {
  static getMediaUrl(
    path: string,
    configService: ConfigService<AllConfigType>,
  ): string {
    // Normalize path to handle different OS path separators
    const normalizedPath = normalize(path).replace(/\\/g, '/');

    // Get base URL from config
    const baseUrl = configService.get('app.url', { infer: true });

    // Remove any leading 'uploads/' if already present in the path
    const cleanPath = normalizedPath.replace(/^uploads[\/\\]?/i, '');

    // Combine to form full URL
    return `${baseUrl}/api/v1/media/path/${cleanPath}`;
  }
}

function generateUniqueFilename(file: Express.Multer.File): string {
  const extension =
    file.originalname?.split('.')?.pop()?.toLowerCase() || '.jpeg';
  const filename = file.originalname?.split('.')?.shift() || 'file-upload';
  return `${filename}-${randomStringGenerator()}.${extension}`;
}

function fileFilter(
  allowedExtensions: string[],
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  const extension = file.originalname.split('.').pop()?.toLowerCase();

  if (!extension || !allowedExtensions.includes(extension)) {
    return callback(new UnprocessableEntityException(), false);
  }

  callback(null, true);
}

export function createMulterOptions(
  configService: ConfigService<AllConfigType>,
) {
  const uploadPath = 'uploads';
  const maxFileSize =
    configService.get('media.maxFileSize', { infer: true }) || MAX_FILE_SIZE;
  const allowedTypes = 'all' as string;

  let allowedExtensions: string[];
  switch (allowedTypes) {
    case 'image':
      allowedExtensions = SUPPORTED_IMAGE_EXTENSIONS;
      break;
    case 'document':
      allowedExtensions = SUPPORTED_DOCUMENT_EXTENSIONS;
      break;
    case 'all':
      allowedExtensions = [
        ...SUPPORTED_IMAGE_EXTENSIONS,
        ...SUPPORTED_DOCUMENT_EXTENSIONS,
      ];
      break;
    default:
      allowedExtensions = SUPPORTED_IMAGE_EXTENSIONS;
  }

  return {
    fileFilter: (_, file: Express.Multer.File, callback: any) =>
      fileFilter(allowedExtensions, file, callback),
    storage: diskStorage({
      destination: uploadPath,
      filename: (_, file, callback) => {
        callback(null, generateUniqueFilename(file));
      },
    }),
    limits: {
      fileSize: maxFileSize,
    },
  };
}

export const getMulterConfig = (
  configService: ConfigService<AllConfigType>,
) => {
  const uploadPath =
    configService.getOrThrow('media.uploadPath', {
      infer: true,
    }) || './uploads';

  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const folder = req.body?.folder || '';
        const finalPath = path.join(uploadPath, folder);

        require('fs').mkdirSync(finalPath, { recursive: true });
        cb(null, finalPath);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  };
};
