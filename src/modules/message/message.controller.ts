import { Controller } from '@nestjs/common';

import { MESSAGES_ROUTE } from '../../configs/routes';

@Controller(MESSAGES_ROUTE)
export class MessageController {}
