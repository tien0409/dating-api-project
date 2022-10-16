import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDTO {
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
