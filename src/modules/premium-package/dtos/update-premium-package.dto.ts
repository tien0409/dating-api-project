import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePremiumPackageDTO {
  @IsNumber()
  @IsNotEmpty()
  numberOfMonths: number;

  @IsNumber()
  @IsNotEmpty()
  price: string;

  @IsString()
  description: string;
}
