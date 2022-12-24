import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { USER_LIKES_ROUTE } from '../../configs/routes';
import { CreateUserLikeDTO } from './dtos/create-user-like.dto';
import { UserLikeService } from './user-like.service';
import { User } from '../users/schemas/user.schema';

@Controller(USER_LIKES_ROUTE)
@UseGuards(AuthGuard('jwt'))
export class UserLikeController {
  constructor(private readonly userLikeService: UserLikeService) {}

  @Post()
  create(@Req() req: Request, @Body() createUserLikeDTO: CreateUserLikeDTO) {
    const user = req.user as User;

    return this.userLikeService.create(user._id, createUserLikeDTO);
  }
}
