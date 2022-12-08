import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { CONVERSATIONS_ROUTE } from '../../configs/routes';
import { ConversationService } from './conversation.service';
import { CreateConversationDTO } from './dtos/create-conversation.dto';
import { User } from '../users/schemas/user.schema';

@Controller(CONVERSATIONS_ROUTE)
@UseGuards(AuthGuard('jwt'))
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  createConversation(
    @Body() createConversationDTO: CreateConversationDTO,
    @Req() req: Request,
  ) {
    const user = req.user as User;

    return this.conversationService.createConversation(
      user._id,
      createConversationDTO,
    );
  }
}
