import { Controller } from '@nestjs/common';

import { PREMIUM_PACKAGES_ADMIN_ROUTE } from '../../configs/routes';

@Controller(PREMIUM_PACKAGES_ADMIN_ROUTE)
export class PremiumPackageAdminController {}
