import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthCredentialsDTO {
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
