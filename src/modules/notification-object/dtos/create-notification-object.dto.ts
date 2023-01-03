import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationObjectDTO {
  @IsNotEmpty()
  @IsString()
  recipient: string;

  @IsNotEmpty()
  @IsString()
  notification: string;
}
