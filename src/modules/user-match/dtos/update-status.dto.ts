import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusDTO {
  @IsString()
  @IsNotEmpty()
  matchId: string;
}
