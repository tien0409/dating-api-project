import { Controller } from '@nestjs/common';

import { USER_GENDERS_ROUTE } from '../../configs/routes';

@Controller(USER_GENDERS_ROUTE)
export class UserGenderController {}
