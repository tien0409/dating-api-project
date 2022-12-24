import { Controller } from '@nestjs/common';

import { USER_LIKES_ROUTE } from '../../configs/routes';

@Controller(USER_LIKES_ROUTE)
export class UserLikeController {}
