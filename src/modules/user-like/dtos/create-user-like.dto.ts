import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserLikeDTO {
  @IsString()
  @IsNotEmpty()
  userLikedId: string;
}
