import { Body, Controller, Post } from '@nestjs/common';

import { USER_MATCHES_ROUTE } from '../../configs/routes';
import { UserMatchService } from './user-match.service';
import { CreateUserMatchDTO } from './dtos/create-user-match.dto';

@Controller(USER_MATCHES_ROUTE)
export class UserMatchController {
  constructor(private readonly userMatchService: UserMatchService) {}

  @Post()
  create(@Body() createUserMatchDTO: CreateUserMatchDTO) {
    return this.userMatchService.create(createUserMatchDTO);
  }
}
