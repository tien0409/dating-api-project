import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserPreferenceDTO {
  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  height: number[];
}
