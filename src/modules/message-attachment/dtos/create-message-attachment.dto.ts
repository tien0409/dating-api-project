import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageAttachmentDTO {
  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  messageId: string;
}
