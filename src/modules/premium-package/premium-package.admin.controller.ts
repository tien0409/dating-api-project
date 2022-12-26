import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { PREMIUM_PACKAGES_ADMIN_ROUTE } from '../../configs/routes';
import { PremiumPackageService } from './premium-package.service';
import { GetPremiumPackagesDTO } from './dtos/get-premium-packages.dto';
import { CreatePremiumPackageDTO } from './dtos/create-premium-package.dto';
import { UpdatePremiumPackageDTO } from './dtos/update-premium-package.dto';
import { UpdateStatusDTO } from './dtos/update-status.dto';

@Controller(PREMIUM_PACKAGES_ADMIN_ROUTE)
export class PremiumPackageAdminController {
  constructor(private readonly premiumPackageService: PremiumPackageService) {}

  @Get()
  getAll(@Query() getPremiumPackagesDTO: GetPremiumPackagesDTO) {
    return this.premiumPackageService.getAdminAll(getPremiumPackagesDTO);
  }

  @Post()
  create(@Body() createPremiumPackageDTO: CreatePremiumPackageDTO) {
    return this.premiumPackageService.create(createPremiumPackageDTO);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePremiumPackageDTO: UpdatePremiumPackageDTO,
  ) {
    return this.premiumPackageService.update(id, updatePremiumPackageDTO);
  }

  @Put('status/:id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDTO: UpdateStatusDTO,
  ) {
    return this.premiumPackageService.updateStatus(id, updateStatusDTO);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.premiumPackageService.delete(id);
  }
}
