import { IsNotEmpty, IsString } from 'class-validator';

export class ReceiverDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
