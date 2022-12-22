import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserMatchStatusDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}
