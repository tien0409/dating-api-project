import { Controller, Get } from '@nestjs/common';
import { GENDERS_ROUTE } from '../../configs/routes';
import { GendersService } from './genders.service';

@Controller(GENDERS_ROUTE)
export class GendersController {
  constructor(private readonly gendersService: GendersService) {}

  @Get()
  getGenders() {
    return this.gendersService.getGenders();
  }
}
