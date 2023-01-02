import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
  CREATE_PROFILE_ROUTE,
  GET_USERS_EXPLORE_ROUTE,
  UPDATE_PROFILE_ROUTE,
  USERS_ROUTE,
} from 'src/configs/routes';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import { CreateProfileDTO } from './dtos/create-profile.dto';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { GetUsersExploreDTO } from './dtos/get-users-explore.dto';
import { UpdateProfileDTO } from './dtos/update-profile.dto';

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
    @Body() createProfileDTO: CreateProfileDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as User;
    await this.usersService.createProfile(user._id, createProfileDTO);
    return res.json();
  }

  @Patch(UPDATE_PROFILE_ROUTE)
  updateProfile(
    @Body() updateProfileDTO: UpdateProfileDTO,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.usersService.updateProfile(user._id, updateProfileDTO);
  }

  @Get(GET_USERS_EXPLORE_ROUTE)
  getUsersExplore(
    @Req() req: Request,
    @Query() getUsersExploreDTO: GetUsersExploreDTO,
  ) {
    const user = req.user as User;

    return this.usersService.getUsersExplore(user._id, getUsersExploreDTO);
  }
}
