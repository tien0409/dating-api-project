import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { USER_PREMIUM_PACKAGES_ROUTE } from '../../configs/routes';
import { UserPremiumPackageService } from './user-premium-package.service';
import { CreateUserPremiumPackageDTO } from './dtos/create-user-premium-package.dto';
import { User } from '../users/schemas/user.schema';
import { PAYMENT_EVENT_EMITTER } from '../gateway/utils/eventEmitterType';

@Controller(USER_PREMIUM_PACKAGES_ROUTE)
@UseGuards(AuthGuard('jwt'))
export class UserPremiumPackageController {
  constructor(
    private readonly userPremiumPackageService: UserPremiumPackageService,
    private readonly emitter: EventEmitter2,
  ) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body() createUserPremiumPackageDTO: CreateUserPremiumPackageDTO,
  ) {
    const { premiumPackageId } = createUserPremiumPackageDTO;
    const user = req.user as User;

    await this.userPremiumPackageService.create(
      user._id,
      createUserPremiumPackageDTO,
    );
    this.emitter.emit(PAYMENT_EVENT_EMITTER.ORDER, {
      userId: user._id,
      premiumPackageId,
    });
  }
}
