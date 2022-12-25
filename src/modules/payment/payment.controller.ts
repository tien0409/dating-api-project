import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PAYMENTS_ROUTE } from '../../configs/routes';
import { PaymentService } from './payment.service';
import { CreateChargeDTO } from './dtos/create-charge.dto';

@Controller(PAYMENTS_ROUTE)
@UseGuards(AuthGuard('jwt'))
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('charge')
  createCharge(@Body() createChargeDTO: CreateChargeDTO) {
    return this.paymentService.createCharge(createChargeDTO);
  }
}
