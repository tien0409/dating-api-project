import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationMatchedDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  userMatchedId: string;

  @IsString()
  @IsNotEmpty()
  conversationId: string;
}
