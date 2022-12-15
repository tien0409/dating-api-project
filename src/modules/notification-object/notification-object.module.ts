import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationObjectController } from './notification-object.controller';
import { NotificationObjectService } from './notification-object.service';
import {
  NotificationObject,
  NotificationObjectSchema,
} from './notification-object.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotificationObject.name, schema: NotificationObjectSchema },
    ]),
  ],
  controllers: [NotificationObjectController],
  providers: [NotificationObjectService],
  exports: [NotificationObjectService],
})
export class NotificationObjectModule {}
