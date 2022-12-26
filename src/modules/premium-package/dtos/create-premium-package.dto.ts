import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePremiumPackageDTO {
  @IsNumber()
  @IsNotEmpty()
  numberOfMonths: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  description: string;
}
