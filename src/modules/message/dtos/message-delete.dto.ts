import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

import { Message } from '../message.schema';
import { Conversation } from '../../conversation/conversation.schema';

export class MessageDeleteDTO {
  @IsNotEmpty()
  @IsString()
  conversation: Conversation;

  @IsNotEmpty()
  @IsString()
  senderParticipantId: string;

  @IsNotEmpty()
  @IsString()
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  messageId: string;
}
