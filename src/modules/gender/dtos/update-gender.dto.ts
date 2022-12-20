import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateGenderDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;
}
