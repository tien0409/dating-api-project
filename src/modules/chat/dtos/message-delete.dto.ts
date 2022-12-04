import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { Message } from '../schemas/message.schema';

export class MessageDeleteDTO {
  @IsNotEmpty()
  @IsNumber()
  indexMessageDeleted: number;

  @IsNotEmpty()
  @IsString()
  senderParticipantId: string;

  @IsNotEmpty()
  @IsString()
  receiverId: string;

  @IsNotEmptyObject()
  @IsObject()
  message: Message;
}
