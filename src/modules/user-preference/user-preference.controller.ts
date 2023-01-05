import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { USER_PREFERENCES_ROUTE } from '../../configs/routes';
import { UserPreferenceService } from './user-preference.service';
import { User } from '../users/schemas/user.schema';
import { UpdateUserPreferenceDTO } from './dtos/update-user-preference.dto';

@Controller(USER_PREFERENCES_ROUTE)
@UseGuards(AuthGuard('jwt'))
export class UserPreferenceController {
  constructor(private readonly userPreferenceService: UserPreferenceService) {}

  @Patch()
  update(@Req() req, @Body() updateUserPreferenceDTO: UpdateUserPreferenceDTO) {
    const user = req.user as User;

    return this.userPreferenceService.update(user._id, updateUserPreferenceDTO);
  }
}
