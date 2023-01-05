import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { PAYMENTS_ROUTE } from '../../configs/routes';
import { PaymentService } from './payment.service';
import { CreateChargeDTO } from './dtos/create-charge.dto';
import { User } from '../users/schemas/user.schema';
import { PAYMENT_EVENT_EMITTER } from '../gateway/utils/eventEmitterType';

@Controller(PAYMENTS_ROUTE)
@UseGuards(AuthGuard('jwt'))
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly emitter: EventEmitter2,
  ) {}

  @Post('charge')
  async createCharge(
    @Req() req: Request,
    @Body() createChargeDTO: CreateChargeDTO,
  ) {
    const { premiumPackageId } = createChargeDTO;
    const user = req.user as User;

    await this.paymentService.createCharge(user, createChargeDTO);
    this.emitter.emit(PAYMENT_EVENT_EMITTER.CHARGE, {
      userId: user._id,
      premiumPackageId,
    });
    return;
  }
}
