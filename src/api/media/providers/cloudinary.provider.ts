import { AllConfigType } from '@/config/config.type';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as fs from 'fs';
import { Readable } from 'stream';
import { FileStorageService } from '../config/media-config.type';

export const createCloudinaryProvider = (
  configService: ConfigService<AllConfigType>,
): FileStorageService => {
  cloudinary.config({
    cloud_name: configService.getOrThrow('media.cloudName', { infer: true }),
    api_key: configService.getOrThrow('media.apiKey', { infer: true }),
    api_secret: configService.getOrThrow('media.apiSecret', { infer: true }),
    secure: true,
  });

  return {
    upload: async (
      file: Express.Multer.File,
      folder?: string,
    ): Promise<UploadApiResponse> => {
      return new Promise((resolve, reject) => {
        // Create upload stream
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder || 'uploads',
            resource_type: 'auto',
            public_id: file.originalname.replace(/\.[^/.]+$/, ''),
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              return reject(error);
            }
            resolve(result);
          },
        );

        // Handle file buffer or path
        if (file.buffer) {
          // File in memory
          const bufferStream = new Readable();
          bufferStream.push(file.buffer);
          bufferStream.push(null); // EOF
          bufferStream.pipe(uploadStream);
        } else if (file.path) {
          // File on disk
          fs.createReadStream(file.path).pipe(uploadStream);
        } else {
          reject(new Error('No file content available'));
        }
      });
    },

    delete: async (publicId: string): Promise<void> => {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
      }
    },
  };
};
