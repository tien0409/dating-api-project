import { Controller } from '@nestjs/common';

import { CONVERSATIONS_ROUTE } from '../../configs/routes';

@Controller(CONVERSATIONS_ROUTE)
export class ConversationController {}
