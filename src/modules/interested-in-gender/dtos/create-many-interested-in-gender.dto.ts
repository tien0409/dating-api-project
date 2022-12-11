import { IsNotEmpty, IsString } from 'class-validator';

export class CreateManyInterestedInGenderDTO {
  @IsString()
  @IsNotEmpty()
  genderIds: string[];
}
