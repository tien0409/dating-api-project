import { Body, Controller, Post } from '@nestjs/common';
import { USER_PHOTOS_ROUTE } from '../../configs/routes';
import { CreateUserPhotosDTO } from './dtos/create-user-photos.dto';
import { UserPhotosService } from './user-photos.service';

@Controller(USER_PHOTOS_ROUTE)
export class UserPhotosController {
  constructor(private readonly userPhotosService: UserPhotosService) {}

  @Post()
  createUserPhotos(@Body() createUserPhotosDto: CreateUserPhotosDTO) {
    return this.userPhotosService.createUserPhotos(createUserPhotosDto);
  }
}
