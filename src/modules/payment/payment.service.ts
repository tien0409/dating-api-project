import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateChargeDTO } from './dtos/create-charge.dto';
import { UserPremiumPackageService } from '../user-premium-package/user-premium-package.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly userPremiumPackageService: UserPremiumPackageService,
  ) {
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

  async createCharge(user: User, chargeDTO: CreateChargeDTO) {
    const { amount, paymentMethodId, premiumPackageId } = chargeDTO;

    const stripeCreated = await this.stripe.paymentIntents.create({
      amount: amount * 50,
      currency: this.configService.get('stripe.currency'),
      customer: user.stripeCustomerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
    });

    await this.userPremiumPackageService.create(user._id, {
      premiumPackageId,
    });

    return stripeCreated;
  }
}
