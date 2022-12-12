import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { Message } from '../message.schema';

export class CreateMessageDTO {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  senderParticipantId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsObject()
  @IsOptional()
  replyTo?: Message;

  @IsArray()
  @IsOptional()
  attachments?: string[];
}
