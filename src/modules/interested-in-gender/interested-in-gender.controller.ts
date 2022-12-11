import { Body, Controller, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { INTERESTED_IN_GENDERS_ROUTE } from '../../configs/routes';
import { InterestedInGenderService } from './interested-in-gender.service';
import { User } from '../users/schemas/user.schema';
import { CreateManyInterestedInGenderDTO } from './dtos/create-many-interested-in-gender.dto';

@Controller(INTERESTED_IN_GENDERS_ROUTE)
@UseGuards(AuthGuard('jwt'))
export class InterestedInGenderController {
  constructor(
    private readonly interestedInGenderService: InterestedInGenderService,
  ) {}

  createMany(
    @Req() req: Request,
    @Body() createManyInterestedInGenderDTO: CreateManyInterestedInGenderDTO,
  ) {
    const user = req.user as User;

    return this.interestedInGenderService.createMany(
      user._id,
      createManyInterestedInGenderDTO,
    );
  }
}
