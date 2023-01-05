import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationService } from './notification.service';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationController } from './notification.controller';
import { NotificationAdminController } from './notification.admin.controller';
import { UsersModule } from '../users/users.module';
import { NotificationObjectModule } from '../notification-object/notification-object.module';

@Module({
  imports: [
    UsersModule,
    NotificationObjectModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController, NotificationAdminController],
})
export class NotificationModule {}
