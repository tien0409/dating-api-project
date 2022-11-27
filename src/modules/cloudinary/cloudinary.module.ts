import { Module } from '@nestjs/common';
import {v2} from "cloudinary"
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';

@Module({
  providers: [
    {
      provide: 'CloudinaryProvider',
      useFactory: () => {
        return v2.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        })
      }
    },
    CloudinaryService
  ],
  controllers: [CloudinaryController],
})
export class CloudinaryModule {}
