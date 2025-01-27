import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('appConfig', () => ({
  cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinarySecretKey: process.env.CLOUDINARY_API_SECRET,
}));
