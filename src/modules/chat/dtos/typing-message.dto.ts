import { IsNotEmpty, IsString } from 'class-validator';

export class TypingMessageDTO {
  @IsNotEmpty()
  @IsString()
  conversationId: string;
}
