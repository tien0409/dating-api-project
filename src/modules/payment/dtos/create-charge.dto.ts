import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChargeDTO {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;
}
