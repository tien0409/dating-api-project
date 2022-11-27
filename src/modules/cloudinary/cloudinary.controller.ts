import {
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UPLOAD_ROUTE, UPLOAD_SINGLE_IMAGE } from 'src/configs/routes';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import { CloudinaryService } from './cloudinary.service';

@Controller(UPLOAD_ROUTE)
@UseGuards(JwtAuthenticationGuard)
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post(UPLOAD_SINGLE_IMAGE)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: any) {
    return this.cloudinaryService.uploadImage(file);
  }
}
