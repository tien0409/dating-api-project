import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateNotificationObjectDTO } from './dtos/create-notification-object.dto';
import {
  NotificationObject,
  NotificationObjectDocument,
} from './notification-object.schema';
import { ACTIVE } from '../../configs/constants.config';

@Injectable()
export class NotificationObjectService {
  constructor(
    @InjectModel(NotificationObject.name)
    private readonly notificationObjectModel: Model<NotificationObjectDocument>,
  ) {}

  getByNotificationId(notificationId: string) {
    return this.notificationObjectModel
      .find({
        notification: new Types.ObjectId(notificationId),
      })
      .populate('notification');
  }

  async getByUserId(userId: string) {
    const notifications = await this.notificationObjectModel
      .find({
        recipient: new Types.ObjectId(userId),
      })
      .populate({
        path: 'notification',
        populate: {
          path: 'sender',
        },
      })
      .sort({ createdAt: -1 });

    const result = notifications.map((_notification) => {
      const { notification, ...notificationObject } = _notification.toObject();
      return {
        ...notificationObject,
        sender: notification.sender,
        message: notification.message,
        type: notification.type,
        title: notification.title,
      };
    });

    return { notifications: result };
  }

  read(userId: string, notificationObjectId: string) {
    return this.notificationObjectModel.findByIdAndUpdate(
      {
        _id: new Types.ObjectId(notificationObjectId),
      },
      {
        isRead: true,
      },
      { new: true },
    );
  }

  unread(userId: string, notificationObjectId: string) {
    return this.notificationObjectModel.findByIdAndUpdate(
      {
        _id: new Types.ObjectId(notificationObjectId),
      },
      {
        isRead: false,
      },
      { new: true },
    );
  }

  async readAll(userId: string) {
    await this.notificationObjectModel.updateMany(
      {
        recipient: new Types.ObjectId(userId),
      },
      {
        isRead: true,
      },
    );

    return this.getByUserId(userId);
  }

  async delete(userId: string, notificationObjectId: string) {
    await this.notificationObjectModel.deleteOne({
      _id: new Types.ObjectId(notificationObjectId),
    });
  }

  async deleteAll(userId: string) {
    await this.notificationObjectModel.deleteMany({
      recipient: new Types.ObjectId(userId),
    });
  }

  createMany(createNotificationObjectsDTO: CreateNotificationObjectDTO[]) {
    return this.notificationObjectModel.insertMany(
      createNotificationObjectsDTO,
    );
  }

  updateStatusByNotificationId(notificationId: string) {
    return this.notificationObjectModel.updateMany(
      {
        notification: new Types.ObjectId(notificationId),
      },
      {
        $set: {
          status: ACTIVE,
        },
      },
      { new: true },
    );
  }
}
