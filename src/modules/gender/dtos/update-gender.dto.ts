import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateGenderDTO {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;
}
