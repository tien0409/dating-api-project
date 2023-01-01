import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { USER_PREMIUM_PACKAGES_ROUTE } from '../../configs/routes';
import { UserPremiumPackageService } from './user-premium-package.service';
import { CreateUserPremiumPackageDTO } from './dtos/create-user-premium-package.dto';
import { User } from '../users/schemas/user.schema';

@Controller(USER_PREMIUM_PACKAGES_ROUTE)
@UseGuards(AuthGuard('jwt'))
export class UserPremiumPackageController {
  constructor(
    private readonly userPremiumPackageService: UserPremiumPackageService,
  ) {}

  @Post()
  create(
    @Req() req: Request,
    @Body() createUserPremiumPackageDTO: CreateUserPremiumPackageDTO,
  ) {
    const user = req.user as User;

    return this.userPremiumPackageService.create(
      user._id,
      createUserPremiumPackageDTO,
    );
  }
}
