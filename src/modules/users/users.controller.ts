import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
  CREATE_PROFILE_ROUTE,
  GET_USERS_EXPLORE_ROUTE,
  USERS_ROUTE,
} from 'src/configs/routes';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import { CreateProfileDTO } from './dtos/create-profile.dto';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller(USERS_ROUTE)
@UseGuards(JwtAuthenticationGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getMyProfile(@Req() req: Request) {
    const { user } = req;
    return user;
  }

  @Post(CREATE_PROFILE_ROUTE)
  async createProfile(
    @Body() updateProfileDTO: CreateProfileDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as User;
    await this.usersService.createProfile(user._id, updateProfileDTO);
    return res.json();
  }

  @Get(GET_USERS_EXPLORE_ROUTE)
  getUsersExplore(@Req() req: Request) {
    const user = req.user as User;

    return this.usersService.getUsersExplore(user);
  }
}
