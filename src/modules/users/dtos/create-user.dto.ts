import { MinLength } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsString } from 'class-validator/types/decorator/decorators';
import { MaxLength } from 'class-validator/types/decorator/decorators';

export class CreateUserDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  username?: string;

  @IsString()
  @MinLength(8)
  password?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  passwordConfirm?: string;
}
