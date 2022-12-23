import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetUsersExploreDTO {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  page: number;
}
