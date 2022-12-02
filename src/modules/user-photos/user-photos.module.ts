import { Module } from '@nestjs/common';
import { UserPhotosController } from './user-photos.controller';
import { UserPhotosService } from './user-photos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPhoto, UserPhotoSchema } from './user-photo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserPhoto.name,
        schema: UserPhotoSchema,
      },
    ]),
  ],
  controllers: [UserPhotosController],
  providers: [UserPhotosService],
  exports: [UserPhotosService],
})
export class UserPhotosModule {}
