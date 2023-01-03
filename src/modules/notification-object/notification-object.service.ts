import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationObjectDTO } from './dtos/create-notification-object.dto';
import {
  NotificationObject,
  NotificationObjectDocument,
} from './notification-object.schema';

@Injectable()
export class NotificationObjectService {
  constructor(
    @InjectModel(NotificationObject.name)
    private readonly notificationObjectModel: Model<NotificationObjectDocument>,
  ) {}

  createMany(createNotificationObjectsDTO: CreateNotificationObjectDTO[]) {
    return this.notificationObjectModel.insertMany(
      createNotificationObjectsDTO,
    );
  }
}
