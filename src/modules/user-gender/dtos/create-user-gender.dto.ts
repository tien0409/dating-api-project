import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserGenderDTO {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  userGenderId: string;
}
