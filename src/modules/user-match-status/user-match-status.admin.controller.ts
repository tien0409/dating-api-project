import { Body, Controller, Get, Post } from '@nestjs/common';

import { USER_MATCH_STATUSES_ADMIN_ROUTE } from '../../configs/routes';
import { UserMatchStatusService } from './user-match-status.service';
import { CreateUserMatchStatusDTO } from './dtos/create-user-match-status.dto';

@Controller(USER_MATCH_STATUSES_ADMIN_ROUTE)
export class UserMatchStatusAdminController {
  constructor(
    private readonly userMatchStatusService: UserMatchStatusService,
  ) {}

  @Get()
  getAll() {
    return this.userMatchStatusService.getAll();
  }

  @Post()
  create(@Body() createUserMatchStatusDTO: CreateUserMatchStatusDTO) {
    return this.userMatchStatusService.create(createUserMatchStatusDTO);
  }
}
