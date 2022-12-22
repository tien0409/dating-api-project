import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserMatchTypeDTO {
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
