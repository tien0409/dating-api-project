import { Module } from '@nestjs/common';
import { PremiumPackageService } from './premium-package.service';
import { PremiumPackageController } from './premium-package.controller';
import { PremiumPackageAdminController } from './premium-package.admin.controller';

@Module({
  providers: [PremiumPackageService],
  controllers: [PremiumPackageController, PremiumPackageAdminController],
})
export class PremiumPackageModule {}
