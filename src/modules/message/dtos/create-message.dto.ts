import { IsNotEmpty, IsObject, IsString } from 'class-validator';

import { Message } from '../message.schema';

export class CreateMessageDTO {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  participant: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsObject()
  replyTo?: Message;
}
