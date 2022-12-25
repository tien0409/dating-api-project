import { Controller } from '@nestjs/common';

import { PREMIUM_PACKAGES_ROUTE } from '../../configs/routes';

@Controller(PREMIUM_PACKAGES_ROUTE)
export class PremiumPackageController {}
