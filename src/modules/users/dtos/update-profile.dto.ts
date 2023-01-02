import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { Gender } from '../../gender/gender.schema';
import { UserGender } from '../../user-gender/user-gender.schema';

export class UpdateProfileDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(20)
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(15)
  lastName?: string;

  @IsDateString()
  @IsOptional()
  @IsNotEmpty()
  birthday?: Date;

  @IsObject()
  @IsOptional()
  @IsNotEmptyObject()
  userGender?: UserGender;

  @IsObject()
  @IsOptional()
  @IsNotEmptyObject()
  interestedInGender?: Gender;

  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  userPhotos?: string[];

  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  passions?: string[];

  @IsOptional()
  bio?: string;
}
