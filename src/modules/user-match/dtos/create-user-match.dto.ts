import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserMatchDTO {
  @IsNotEmpty()
  @IsString()
  userMatchedId: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
