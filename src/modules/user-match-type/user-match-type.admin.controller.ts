import { Body, Controller, Get, Post } from '@nestjs/common';

import { USER_MATCH_TYPES_ADMIN_ROUTE } from '../../configs/routes';
import { CreateUserMatchTypeDTO } from './dtos/create-user-match-type.dto';
import { UserMatchTypeService } from './user-match-type.service';

@Controller(USER_MATCH_TYPES_ADMIN_ROUTE)
export class UserMatchTypeAdminController {
  constructor(private readonly userMatchTypesService: UserMatchTypeService) {}

  @Get()
  getAll() {
    return this.userMatchTypesService.getAll();
  }

  @Post()
  create(@Body() createUserMatchTypeDTO: CreateUserMatchTypeDTO) {
    return this.userMatchTypesService.create(createUserMatchTypeDTO);
  }
}
