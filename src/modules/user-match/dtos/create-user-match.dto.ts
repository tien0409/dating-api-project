import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserMatchDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  userMatchId: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
