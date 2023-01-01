import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

const toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadMultiImage(files: Express.Multer.File[]) {
    const result = [];
    for (const file of files) {
      const item = await this.uploadImage(file);
      result.push(item);
    }

    return result;
  }
}
