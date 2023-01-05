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
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    AuthModule,
    ConversationModule,
    MessageModule,
    ParticipantModule,
    UserMatchModule,
    UserLikeModule,
    UserDiscardModule,
    NotificationModule,
  ],
  providers: [
    Gateway,
    {
      provide: GatewaySessionManager.name,
      useClass: GatewaySessionManager,
    },
  ],
  exports: [Gateway],
})
export class GatewayModule {}
