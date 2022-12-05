import { IsNotEmpty, IsObject, IsString } from 'class-validator';

import { Message } from '../../message/message.schema';

export class SendMessageDTO {
  @IsNotEmpty()
  @IsString()
  receiverId: string;

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
