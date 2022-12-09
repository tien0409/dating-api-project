import { IsNotEmpty, IsString } from 'class-validator';

export class LeftConversationDTO {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
