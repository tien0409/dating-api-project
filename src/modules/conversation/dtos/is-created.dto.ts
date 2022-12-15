import { IsNotEmpty, IsString } from 'class-validator';

export class IsCreatedDTO {
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  receiverId: string;
}
