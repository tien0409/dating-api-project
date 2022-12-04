import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDTO {
  @IsNotEmpty()
  @IsString()
  receiverParticipantId: string;

  @IsNotEmpty()
  @IsString()
  senderParticipantId: string;

  @IsNotEmpty()
  @IsString()
  conversationId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
