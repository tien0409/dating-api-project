import { IsNotEmpty, IsString } from 'class-validator';

export class GetByParticipantIdDTO {
  @IsString()
  @IsNotEmpty()
  participantId: string;

  @IsString()
  @IsNotEmpty()
  conversationId: string;
}
