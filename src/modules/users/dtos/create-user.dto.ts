import { MinLength } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsString, Matches } from 'class-validator/types/decorator/decorators';
import { emailRegex } from 'src/utils/regexes';

export class CreateUserDTO {
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

  @IsString()
  confirmationCode?: string;
}
