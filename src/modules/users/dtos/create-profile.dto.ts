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

export class CreateProfileDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  birthday: Date;

  @IsObject()
  @IsNotEmptyObject()
  userGender: UserGender;

  @IsObject()
  @IsNotEmptyObject()
  interestedInGender: Gender;

  @IsArray()
  @IsNotEmpty()
  userPhotos: string[];

  @IsArray()
  @IsNotEmpty()
  passions: string[];

  @IsOptional()
  bio?: string;
}
