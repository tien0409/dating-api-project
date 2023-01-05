import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePhotoDTO {
  @IsString()
  @IsNotEmpty()
  link: string;
}
