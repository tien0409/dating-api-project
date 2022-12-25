import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PremiumPackage } from './premium-package.schema';
import { PremiumPackageService } from './premium-package.service';
import { PremiumPackageController } from './premium-package.controller';
import { PremiumPackageAdminController } from './premium-package.admin.controller';
import { UserPremiumPackageSchema } from '../user-premium-package/user-premium-package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PremiumPackage.name, schema: UserPremiumPackageSchema },
    ]),
  ],
  providers: [PremiumPackageService],
  controllers: [PremiumPackageController, PremiumPackageAdminController],
})
export class PremiumPackageModule {}
