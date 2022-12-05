import { IsNotEmpty, IsString } from 'class-validator';

export class GetMessagesDTO {
  @IsNotEmpty()
  @IsString()
  conversationId: string;
}
