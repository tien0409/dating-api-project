import {
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UPLOAD_MULTI_IMAGE, UPLOAD_ROUTE, UPLOAD_SINGLE_IMAGE } from 'src/configs/routes';
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

  @Post(UPLOAD_MULTI_IMAGE)
  @UseInterceptors(FilesInterceptor('files'))
  uploadMultiImage(@UploadedFiles() files: any[]) {
    return this.cloudinaryService.uploadMultiImage(files);
  }
}
