import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserPremiumPackageService } from './user-premium-package.service';
import { UserPremiumPackageController } from './user-premium-package.controller';
import { UserPremiumPackageAdminController } from './user-premium-package.admin.controller';
import {
  UserPremiumPackage,
  UserPremiumPackageSchema,
} from './user-premium-package.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserPremiumPackage.name, schema: UserPremiumPackageSchema },
    ]),
  ],
  providers: [UserPremiumPackageService],
  controllers: [
    UserPremiumPackageController,
    UserPremiumPackageAdminController,
  ],
  exports: [UserPremiumPackageService],
})
export class UserPremiumPackageModule {}
