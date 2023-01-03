import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDTO {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  recipientIds: string[];

  @IsOptional()
  isAll: boolean;
}
