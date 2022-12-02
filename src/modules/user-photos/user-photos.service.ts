import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserPhoto, UserPhotoDocument } from './user-photo.schema';
import { Model } from 'mongoose';
import { CreateUserPhotosDTO } from './dtos/create-user-photos.dto';

@Injectable()
export class UserPhotosService {
  constructor(
    @InjectModel(UserPhoto.name)
    private readonly userPhotoModel: Model<UserPhotoDocument>,
  ) {}

  createUserPhotos(createUserPhotosDto: CreateUserPhotosDTO) {
    return this.userPhotoModel.insertMany(createUserPhotosDto.userPhotos);
  }
}
