import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePhotoDTO {
  @IsString()
  @IsNotEmpty()
  link: string;
}
