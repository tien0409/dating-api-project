import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateChargeDTO } from './dtos/create-charge.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('stripe.secretKey'), {
      apiVersion: '2022-11-15',
    });
  }

  createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }

  createCharge(customerId: string, chargeDTO: CreateChargeDTO) {
    const { amount, paymentMethodId } = chargeDTO;

    return this.stripe.paymentIntents.create({
      amount,
      currency: this.configService.get('stripe.currency'),
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
    });
  }
}
