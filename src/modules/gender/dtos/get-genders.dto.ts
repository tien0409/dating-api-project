import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetGendersDTO {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsString()
  @IsOptional()
  search?: string;
}
