import { IsNotEmpty, IsString } from 'class-validator';

export class ConversationDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
