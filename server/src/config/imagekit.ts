import ImageKit from '@imagekit/nodejs';
import { envConfig } from './index';

let imagekitInstance: ImageKit | null = null;

export const getImageKit = (): ImageKit => {
  if (!imagekitInstance) {
    if (!envConfig.IMAGEKIT_PRIVATE_KEY) {
      throw new Error('ImageKit credentials are not configured. Set IMAGEKIT_PRIVATE_KEY in .env');
    }
    imagekitInstance = new ImageKit({
      privateKey: envConfig.IMAGEKIT_PRIVATE_KEY,
    });
  }
  return imagekitInstance;
};
