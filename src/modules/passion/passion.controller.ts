import { Controller, Get } from '@nestjs/common';

import { PASSIONS_ROUTE } from '../../configs/routes';
import { PassionService } from './passion.service';

@Controller(PASSIONS_ROUTE)
export class PassionController {
  constructor(private readonly passionService: PassionService) {}

  @Get()
  getAll() {
    return this.passionService.getAll();
  }
}
