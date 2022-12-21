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

import { PASSIONS_ADMIN_ROUTE } from '../../configs/routes';
import { PassionService } from './passion.service';
import { GetPassionsDTO } from './dtos/get-passions.dto';
import { CreatePassionDTO } from './dtos/create-passion.dto';
import { UpdatePassionDTO } from './dtos/update-passion.dto';

@Controller(PASSIONS_ADMIN_ROUTE)
export class PassionAdminController {
  constructor(private readonly passionService: PassionService) {}

  @Get()
  getAll(@Query() getPassionsDTO: GetPassionsDTO) {
    return this.passionService.getAdminAll(getPassionsDTO);
  }

  @Post()
  create(@Body() createPassionDTO: CreatePassionDTO) {
    return this.passionService.create(createPassionDTO);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePassionDTO: UpdatePassionDTO) {
    return this.passionService.update(id, updatePassionDTO);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.passionService.delete(id);
  }
}
