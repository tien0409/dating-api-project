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
  GENDERS_ROUTE,
  USERS_ROUTE,
} from 'src/configs/routes';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import { UpdateProfileDTO } from './dtos/create-profile.dto';
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

  @Get(GENDERS_ROUTE)
  getGenders() {
    return this.usersService.getGenders();
  }

  @Post(CREATE_PROFILE_ROUTE)
  async createProfile(
    @Body() updateProfileDTO: UpdateProfileDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as User;
    await this.usersService.updateProfile(user._id, updateProfileDTO);
    return res.json();
  }
}
