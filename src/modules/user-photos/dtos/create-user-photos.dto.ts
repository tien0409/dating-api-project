import { IsArray, IsNotEmpty } from 'class-validator';
import { UserPhoto } from '../user-photo.schema';

export class CreateUserPhotosDTO {
  @IsArray()
  @IsNotEmpty()
  userPhotos: UserPhoto[];
}
