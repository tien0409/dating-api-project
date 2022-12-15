import {
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { emailRegex } from '../../../utils/regexes';
import { Role } from '../../role/role.schema';

export class CreateUserDTO {
  @IsString()
  @Matches(emailRegex)
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  confirmationCode: string;

  @IsObject()
  @IsOptional()
  role?: Role;
}
