import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationTypeService } from './notification-type.service';
import { NotificationTypeController } from './notification-type.controller';
import {
  NotificationType,
  NotificationTypeSchema,
} from './notification-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotificationType.name, schema: NotificationTypeSchema },
    ]),
  ],
  providers: [NotificationTypeService],
  controllers: [NotificationTypeController],
  exports: [NotificationTypeService],
})
export class NotificationTypeModule {}
