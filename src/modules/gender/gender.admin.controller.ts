import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { CREATE_ROUTE, GENDERS_ADMIN_ROUTE } from '../../configs/routes';
import { GenderService } from './gender.service';
import { CreateGenderDTO } from './dtos/create-gender.dto';
import { UpdateGenderDTO } from './dtos/update-gender.dto';
import { GetGendersDTO } from './dtos/get-genders.dto';

@Controller(GENDERS_ADMIN_ROUTE)
export class GenderAdminController {
  constructor(private readonly genderService: GenderService) {}

  @Get()
  getAll(@Query() getGendersDTO: GetGendersDTO) {
    return this.genderService.getAdminAll(getGendersDTO);
  }

  @Post(CREATE_ROUTE)
  create(@Body() createGenderDTO: CreateGenderDTO) {
    return this.genderService.create(createGenderDTO);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGenderDTO: UpdateGenderDTO) {
    return this.genderService.update(id, updateGenderDTO);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.genderService.delete(id);
  }
}
