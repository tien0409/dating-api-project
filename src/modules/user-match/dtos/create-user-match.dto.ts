import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateUserMatchDTO {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => new Types.ObjectId(value))
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => new Types.ObjectId(value))
  userMatchId: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
