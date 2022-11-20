import { IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { emailRegex } from 'src/utils/regexes';

export class AuthCredentialsDTO {
  @IsString()
  @Matches(emailRegex)
  email?: string;

  @IsString()
  @MinLength(8)
  password?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  passwordConfirm?: string;
}
