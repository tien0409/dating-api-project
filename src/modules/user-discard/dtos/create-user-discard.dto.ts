import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDiscardDTO {
  @IsNotEmpty()
  @IsString()
  userDiscardId: string;
}
