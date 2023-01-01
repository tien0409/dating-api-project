import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserPremiumPackageDTO {
  @IsNotEmpty()
  @IsString()
  premiumPackageId: string;
}
