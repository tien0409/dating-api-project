import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChargeDTO {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;

  @IsNotEmpty()
  @IsString()
  premiumPackageId: string;
}
