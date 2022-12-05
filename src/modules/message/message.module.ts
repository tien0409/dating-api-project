import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ParticipantModule } from '../participant/participant.module';
import { Message, MessageSchema } from './message.schema';
import {
  Conversation,
  ConversationSchema,
} from '../conversation/conversation.schema';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [
    ConversationModule,
    ParticipantModule,
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
