import { IsNotEmpty, IsString } from 'class-validator';

export class GetByUserIdDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
