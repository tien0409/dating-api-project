import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConversationDTO {
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsOptional()
  conversationType?: string;
}
