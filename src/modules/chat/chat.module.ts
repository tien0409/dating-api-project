import { Module } from '@nestjs/common';

import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { ChatSessionManager } from './chat.session';
import { MessageModule } from '../message/message.module';
import { ParticipantModule } from '../participant/participant.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [AuthModule, ConversationModule, MessageModule, ParticipantModule],
  providers: [
    ChatGateway,
    {
      provide: ChatSessionManager.name,
      useClass: ChatSessionManager,
    },
  ],
})
export class ChatModule {}
