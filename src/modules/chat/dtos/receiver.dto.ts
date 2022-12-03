import { IsNotEmpty, IsString } from 'class-validator';

export class ReceiverDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
