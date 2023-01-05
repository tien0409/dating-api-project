import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PremiumPackage, PremiumPackageSchema } from './premium-package.schema';
import { PremiumPackageService } from './premium-package.service';
import { PremiumPackageController } from './premium-package.controller';
import { PremiumPackageAdminController } from './premium-package.admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PremiumPackage.name, schema: PremiumPackageSchema },
    ]),
  ],
  providers: [PremiumPackageService],
  controllers: [PremiumPackageController, PremiumPackageAdminController],
  exports: [PremiumPackageService],
})
export class PremiumPackageModule {}
