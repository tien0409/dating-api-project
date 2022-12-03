import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDTO {
  @IsNotEmpty()
  @IsString()
  content: string;
}
