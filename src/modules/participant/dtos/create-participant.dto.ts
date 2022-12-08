import { IsNotEmpty, IsString } from 'class-validator';

export class CreateParticipantDTO {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
