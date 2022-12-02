import { Controller, Get } from '@nestjs/common';
import { GENDERS_ROUTE } from '../../configs/routes';
import { GendersService } from './genders.service';

@Controller(GENDERS_ROUTE)
export class GendersController {
  constructor(private readonly gendersService: GendersService) {}

  @Get()
  async getGenders() {
    const genders = await this.gendersService.getGenders();
    if (genders.length > 2) {
      return {
        normal: genders.slice(0, 2),
        special: genders.slice(2),
      };
    }

    return { normal: genders };
  }
}
