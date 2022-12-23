import { IsNotEmpty, IsString } from 'class-validator';

export class CheckExistingMatchDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  userMatchId: string;
}
