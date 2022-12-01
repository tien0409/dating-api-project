import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CREATE_PROFILE_ROUTE, USERS_ROUTE } from 'src/configs/routes';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import { UpdateProfileDTO } from './dtos/update-profile.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

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
  createProfile(
    @Body() updateProfileDto: UpdateProfileDTO,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.usersService.createProfile(user._id, updateProfileDto);
  }
}
