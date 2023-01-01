import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { PAYMENTS_ROUTE } from '../../configs/routes';
import { PaymentService } from './payment.service';
import { CreateChargeDTO } from './dtos/create-charge.dto';
import { User } from '../users/schemas/user.schema';

@Controller(PAYMENTS_ROUTE)
@UseGuards(AuthGuard('jwt'))
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('charge')
  createCharge(@Req() req: Request, @Body() createChargeDTO: CreateChargeDTO) {
    const user = req.user as User;

    return this.paymentService.createCharge(user, createChargeDTO);
  }
}
