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
import { CREATE_PROFILE_ROUTE, USERS_ROUTE } from 'src/configs/routes';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import { CreateProfileDTO } from './dtos/create-profile.dto';
import { UsersService } from './users.service';
import { UserLogin } from '../user-logins/user-login.schema';

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
    @Body() createProfileDto: CreateProfileDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userLogin = req.user as UserLogin;
    await this.usersService.createProfile(userLogin.id, createProfileDto);
    return res.json();
  }
}
