import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDTO {
  @IsNotEmpty()
  @IsString()
  conversationId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
