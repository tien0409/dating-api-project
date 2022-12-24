import { IsNotEmpty, IsString } from 'class-validator';

export class CheckExistingLikeDTO {
  @IsString()
  @IsNotEmpty()
  userLikedId: string;
}
