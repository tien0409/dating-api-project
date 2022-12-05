import { IsNotEmpty, IsString } from 'class-validator';

import { Message } from '../../message/message.schema';

export class UpdateLastMessageDTO {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  lastMessage?: Message;
}
