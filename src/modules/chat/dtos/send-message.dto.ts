import { IsNotEmpty, IsObject, IsString } from 'class-validator';

import { Message } from '../schemas/message.schema';

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

  @IsObject()
  replyTo?: Message;
}
