import { Controller, Get } from '@nestjs/common';

import { GENDERS_ROUTE } from '../../configs/routes';
import { GenderService } from './gender.service';

@Controller(GENDERS_ROUTE)
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Get()
  getGenders() {
    return this.genderService.getAll();
  }
}
