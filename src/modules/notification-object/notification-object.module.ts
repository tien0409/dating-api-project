import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationObjectService } from './notification-object.service';
import {
  NotificationObject,
  NotificationObjectSchema,
} from './notification-object.schema';
import { NotificationObjectController } from './notification-object.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotificationObject.name, schema: NotificationObjectSchema },
    ]),
  ],
  providers: [NotificationObjectService],
  exports: [NotificationObjectService],
  controllers: [NotificationObjectController],
})
export class NotificationObjectModule {}
