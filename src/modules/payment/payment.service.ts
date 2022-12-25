import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateChargeDTO } from './dtos/create-charge.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('payment.secretKey'), {
      apiVersion: '2022-11-15',
    });
  }

  createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }

  createCharge(chargeDTO: CreateChargeDTO) {
    const { amount, paymentMethodId, customerId } = chargeDTO;

    return this.stripe.paymentIntents.create({
      amount,
      currency: this.configService.get('payment.currency'),
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
    });
  }
}
