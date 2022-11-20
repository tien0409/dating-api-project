import { MinLength } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsEmail, IsString } from 'class-validator/types/decorator/decorators';

export class CreateUserDTO {
  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(8)
  password?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  passwordConfirm?: string;
}
