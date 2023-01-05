import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { USER_MATCHES_ROUTE } from '../../configs/routes';
import { UserMatchService } from './user-match.service';
import { User } from '../users/schemas/user.schema';

@Controller(USER_MATCHES_ROUTE)
@UseGuards(AuthGuard('jwt'))
export class UserMatchController {
  constructor(private readonly userMatchService: UserMatchService) {}

  @Get()
  getByUserId(@Req() req: Request) {
    const user = req.user as User;

    return this.userMatchService.getByUserId(user._id);
  }
}
