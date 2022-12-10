import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTimeJoinedDTO {
  @IsString()
  @IsNotEmpty()
  conversationId: string;
}
