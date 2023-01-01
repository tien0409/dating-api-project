import { Controller, Get } from '@nestjs/common';

import { PREMIUM_PACKAGES_ROUTE } from '../../configs/routes';
import { PremiumPackageService } from './premium-package.service';

@Controller(PREMIUM_PACKAGES_ROUTE)
export class PremiumPackageController {
  constructor(private readonly premiumPackageService: PremiumPackageService) {}

  @Get()
  getActive() {
    return this.premiumPackageService.getActive();
  }
}
