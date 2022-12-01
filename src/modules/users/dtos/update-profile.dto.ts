import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  lastName?: string;

  @IsDateString()
  @IsNotEmpty()
  birthday?: Date;

  @IsString()
  @IsNotEmpty()
  gender?: string;

  @IsArray()
  @IsNotEmpty()
  userPhotos?: string[];

  @IsOptional()
  bio?: string;
}
