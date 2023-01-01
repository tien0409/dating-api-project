import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { UserPremiumPackageModule } from '../user-premium-package/user-premium-package.module';

@Module({
  imports: [ConfigModule, UserPremiumPackageModule],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
