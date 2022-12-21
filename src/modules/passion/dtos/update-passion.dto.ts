import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePassionDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  bgColor: string;

  @IsString()
  @IsNotEmpty()
  fgColor: string;

  @IsString()
  @IsNotEmpty()
  borderColor: string;

  @IsString()
  description: string;
}
