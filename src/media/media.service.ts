import { Injectable } from '@nestjs/common';
import { UpdateMediaDto } from './dto/update-media.dto';
import { UploadApiResponse } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get<string>('appConfig.cloudinaryName'),
      api_key: configService.get<string>('appConfig.cloudinaryApiKey'),
      api_secret: configService.get<string>('appConfig.cloudinarySecretKey'),
    });
  }

  async uploadImages(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'products', resource_type: 'image' },
          (error: Error, result: UploadApiResponse) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          },
        )
        .end(file.buffer);
    });
  }

  findAll() {
    return `This action returns all media`;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
