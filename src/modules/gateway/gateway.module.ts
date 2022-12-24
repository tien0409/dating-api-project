import { Module } from '@nestjs/common';

import { Gateway } from './gateway';
import { AuthModule } from '../auth/auth.module';
import { GatewaySessionManager } from './gateway.session';
import { MessageModule } from '../message/message.module';
import { ParticipantModule } from '../participant/participant.module';
import { ConversationModule } from '../conversation/conversation.module';
import { UserMatchModule } from '../user-match/user-match.module';
import { UserLikeModule } from '../user-like/user-like.module';
import { UserDiscardModule } from '../user-discard/user-discard.module';

@Module({
  imports: [
    AuthModule,
    ConversationModule,
    MessageModule,
    ParticipantModule,
    UserMatchModule,
    UserLikeModule,
    UserDiscardModule,
  ],
  providers: [
    Gateway,
    {
      provide: GatewaySessionManager.name,
      useClass: GatewaySessionManager,
    },
  ],
})
export class GatewayModule {}
