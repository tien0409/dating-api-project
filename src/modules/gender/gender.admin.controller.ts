import { Body, Controller, Get, Post } from '@nestjs/common';

import {
  ADMIN_ROUTE,
  CREATE_ROUTE,
  GENDERS_ADMIN_ROUTE,
} from '../../configs/routes';
import { GenderService } from './gender.service';
import { CreateGenderDTO } from './dtos/create-gender.dto';

@Controller(GENDERS_ADMIN_ROUTE)
export class GenderAdminController {
  constructor(private readonly genderService: GenderService) {}

  @Get()
  getGenders() {
    return this.genderService.getAdminAll();
  }

  @Post(CREATE_ROUTE)
  create(@Body() createGenderDTO: CreateGenderDTO) {
    return this.genderService.create(createGenderDTO);
  }
}
