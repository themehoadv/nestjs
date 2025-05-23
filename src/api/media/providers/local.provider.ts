import { AllConfigType } from '@/config/config.type';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { FileStorageService } from '../config/media-config.type';

export const createLocalProvider = (
  configService: ConfigService<AllConfigType>,
): FileStorageService => {
  const uploadPath =
    configService.getOrThrow('media.uploadPath', {
      infer: true,
    }) || './uploads';

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return {
    upload: async (file, folder) => {
      const finalPath = folder ? path.join(uploadPath, folder) : uploadPath;

      if (!fs.existsSync(finalPath)) {
        fs.mkdirSync(finalPath, { recursive: true });
      }

      const uniqueName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(finalPath, uniqueName);

      fs.writeFileSync(filePath, file.buffer);

      return {
        path: filePath,
        url: `/uploads/${folder ? `${folder}/` : ''}${uniqueName}`,
      };
    },
    delete: async (filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    },
  };
};
