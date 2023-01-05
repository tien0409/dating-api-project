import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
  CREATE_PHOTO_ROUTE,
  CREATE_PROFILE_ROUTE,
  DELETE_PHOTO_ROUTE,
  GET_USERS_EXPLORE_ROUTE,
  UPDATE_PHOTO_ROUTE,
  UPDATE_PROFILE_ROUTE,
  USERS_ROUTE,
} from 'src/configs/routes';
import { JwtAuthenticationGuard } from '../auth/guards/jwt-authentication.guard';
import { CreateProfileDTO } from './dtos/create-profile.dto';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { GetUsersExploreDTO } from './dtos/get-users-explore.dto';
import { UpdateProfileDTO } from './dtos/update-profile.dto';
import { CreatePhotoDTO } from './dtos/create-photo.dto';
import { UpdatePhotoDTO } from './dtos/update-photo.dto';

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

  @Post(CREATE_PHOTO_ROUTE)
  createPhoto(@Req() req: Request, @Body() createPhotoDTO: CreatePhotoDTO) {
    const user = req.user as User;

    return this.usersService.createPhoto(user._id, createPhotoDTO);
  }

  @Patch(UPDATE_PHOTO_ROUTE + '/:id')
  updatePhoto(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updatePhotoDTO: UpdatePhotoDTO,
  ) {
    const user = req.user as User;

    return this.usersService.updatePhoto(user._id, id, updatePhotoDTO);
  }

  @Delete(DELETE_PHOTO_ROUTE + '/:id')
  deletePhoto(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as User;

    return this.usersService.deletePhoto(user._id, id);
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
