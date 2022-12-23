import { Controller } from '@nestjs/common';

import { USER_MATCHES_ROUTE } from '../../configs/routes';
import { UserMatchService } from './user-match.service';

@Controller(USER_MATCHES_ROUTE)
export class UserMatchController {
  constructor(private readonly userMatchService: UserMatchService) {}
}
