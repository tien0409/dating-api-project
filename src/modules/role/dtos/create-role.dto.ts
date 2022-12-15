import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
