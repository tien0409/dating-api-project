import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMessageDTO {
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
