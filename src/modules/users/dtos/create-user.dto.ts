import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

import { emailRegex } from '../../../utils/regexes';

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
}
