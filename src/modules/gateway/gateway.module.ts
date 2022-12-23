import { Module } from '@nestjs/common';

import { Gateway } from './gateway';
import { AuthModule } from '../auth/auth.module';
import { GatewaySessionManager } from './gateway.session';
import { MessageModule } from '../message/message.module';
import { ParticipantModule } from '../participant/participant.module';
import { ConversationModule } from '../conversation/conversation.module';
import { UserMatchModule } from '../user-match/user-match.module';

@Module({
  imports: [
    AuthModule,
    ConversationModule,
    MessageModule,
    ParticipantModule,
    UserMatchModule,
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
