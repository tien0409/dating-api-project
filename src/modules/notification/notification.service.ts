import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import { CreateNotificationDTO } from './dtos/create-notification.dto';
import { ACTIVE, INACTIVE, LIMIT } from '../../configs/constants.config';
import { UsersService } from '../users/users.service';
import { GetNotificationsDTO } from './dtos/get-notifications.dto';
import { CreateNotificationObjectDTO } from '../notification-object/dtos/create-notification-object.dto';
import { NotificationObjectService } from '../notification-object/notification-object.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly userService: UsersService,
    private readonly notificationObjectService: NotificationObjectService,
  ) {}

  async getAdminAll(getNotificationsDTO: GetNotificationsDTO) {
    const { page = 1, search = '' } = getNotificationsDTO;

    const notifications = await this.notificationModel
      .find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      })
      .sort({ _id: -1 })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT);
    const total = await this.notificationModel.countDocuments({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    });

    return {
      notifications,
      pagination: {
        perPage: LIMIT,
        currentPage: page,
        totalPage: Math.ceil(total / LIMIT) || 1,
      },
    };
  }

  async create(userId: string, createNotificationDTO: CreateNotificationDTO) {
    const { recipientIds, isAll, ...data } = createNotificationDTO;

    let notificationObjects: CreateNotificationObjectDTO[] = [];

    const lastNotification = await this.notificationModel
      .findOne()
      .sort({ _id: -1 });
    const lastNumber = parseInt(lastNotification?.code?.split('T')[1]) || 0;
    const code = 'NT' + (lastNumber + 1).toString().padStart(3, '0');

    const notification = await this.notificationModel.create({
      code,
      sender: userId,
      ...data,
    });

    if (recipientIds) {
      notificationObjects = recipientIds.map((recipientId) => {
        return {
          notification: notification._id,
          recipient: recipientId,
        };
      });
    } else {
      const users = await this.userService.getAll();
      notificationObjects = users.map((user) => {
        return {
          notification: notification._id,
          recipient: user._id,
        };
      });
    }
    await this.notificationObjectService.createMany(notificationObjects);
    return notification;
  }

  active(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, { status: ACTIVE });
  }

  inActive(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, { status: INACTIVE });
  }
}
