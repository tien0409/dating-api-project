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
import { GendersModule } from './modules/genders/genders.module';
import { UserLoginsModule } from './modules/user-logins/user-logins.module';
import { UserPhotosModule } from './modules/user-photos/user-photos.module';

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
    GendersModule,
    UserLoginsModule,
    UserPhotosModule,
  ],
  controllers: [],
})
export class AppModule {}
