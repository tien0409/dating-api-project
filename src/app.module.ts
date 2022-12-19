import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { BaseModule } from './modules/base/base.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import envConfigs from './configs/env.config';
import { MongoConfig } from './configs/mongodb.config';
import { MailModule } from './modules/mail/mail.module';
import { ChatModule } from './modules/chat/chat.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { MessageModule } from './modules/message/message.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { ParticipantModule } from './modules/participant/participant.module';
import { GenderModule } from './modules/gender/gender.module';
import { InterestedInGenderModule } from './modules/interested-in-gender/interested-in-gender.module';
import { UserGenderModule } from './modules/user-gender/user-gender.module';
import { MessageAttachmentModule } from './modules/message-attachment/message-attachment.module';
import { NotificationModule } from './modules/notification/notification.module';
import { NotificationObjectModule } from './modules/notification-object/notification-object.module';
import { NotificationTypeModule } from './modules/notification-type/notification-type.module';
import { RoleModule } from './modules/role/role.module';
import { BlockUserModule } from './modules/block-user/block-user.module';
import { UserPreferenceModule } from './modules/user-preference/user-preference.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      load: [envConfigs],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongoConfig,
    }),
    BaseModule,
    AuthModule,
    UsersModule,
    MailModule,
    ChatModule,
    CloudinaryModule,
    MessageModule,
    ConversationModule,
    ParticipantModule,
    GenderModule,
    InterestedInGenderModule,
    UserGenderModule,
    MessageAttachmentModule,
    NotificationModule,
    NotificationObjectModule,
    NotificationTypeModule,
    RoleModule,
    BlockUserModule,
    UserPreferenceModule,
  ],
  controllers: [],
})
export class AppModule {}
