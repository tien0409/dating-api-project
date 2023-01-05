import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Notification,
  NOTIFICATION_MATCHED_TYPE,
  NotificationDocument,
} from './notification.schema';
import { CreateNotificationDTO } from './dtos/create-notification.dto';
import { ACTIVE, INACTIVE, LIMIT } from '../../configs/constants.config';
import { UsersService } from '../users/users.service';
import { GetNotificationsDTO } from './dtos/get-notifications.dto';
import { CreateNotificationObjectDTO } from '../notification-object/dtos/create-notification-object.dto';
import { NotificationObjectService } from '../notification-object/notification-object.service';
import { CreateNotificationMatchedDTO } from './dtos/create-notification-matched.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly userService: UsersService,
    private readonly notificationObjectService: NotificationObjectService,
    private readonly configService: ConfigService,
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

  async getCode() {
    const lastNotification = await this.notificationModel
      .findOne()
      .sort({ _id: -1 });
    const lastNumber = parseInt(lastNotification?.code?.split('T')[1]) || 0;
    return 'NT' + (lastNumber + 1).toString().padStart(3, '0');
  }

  async create(userId: string, createNotificationDTO: CreateNotificationDTO) {
    const { recipientIds, isAll, ...data } = createNotificationDTO;

    let notificationObjects: CreateNotificationObjectDTO[] = [];
    let userIds: string[] = [];

    const code = await this.getCode();

    const notification = await this.notificationModel.create({
      code,
      sender: userId,
      ...data,
    });

    if (recipientIds) {
      userIds = recipientIds;
      notificationObjects = recipientIds.map((recipientId) => {
        return {
          notification: notification._id,
          recipient: recipientId,
        };
      });
    } else {
      const users = await this.userService.getAll({ _id: { $ne: userId } });
      userIds = users.map((user) => user._id);
      notificationObjects = users.map((user) => {
        return {
          notification: notification._id,
          recipient: user._id,
        };
      });
    }
    await this.notificationObjectService.createMany(notificationObjects);
    return { notification, userIds };
  }

  async createNotificationMatched(
    createNotificationMatchedDTO: CreateNotificationMatchedDTO,
  ) {
    const {
      userId,
      userMatchedId,
      conversationId,
    } = createNotificationMatchedDTO;

    const [
      user,
      userPhotos,
      userMatched,
      userMatchedPhotos,
    ] = await Promise.all([
      this.userService.getById(userId),
      this.userService.getPhotosByUserId(userId),
      this.userService.getById(userMatchedId),
      this.userService.getPhotosByUserId(userMatchedId),
    ]);

    const codeUser = await this.getCode();
    const lastNumber = parseInt(codeUser?.split('T')[1]) || 0;
    const codeUserMatched = 'NT' + (lastNumber + 1).toString().padStart(3, '0');
    const notifications = [
      {
        code: codeUser,
        type: NOTIFICATION_MATCHED_TYPE,
        title: 'You have a new match',
        message: `
        <span>You have a new match with <strong>${userMatched.firstName} ${
          userMatched.lastName
        }</strong>. <a href=${
          this.configService.get('clientURL') + '/messages/' + conversationId
        }>Say hello right now! 😍</a></span>
        <div class="mt-4 grid grid-cols-3 grid-rows-${
          userMatchedPhotos?.length > 3 ? 2 : 1
        } gap-5">
        ${userMatchedPhotos
          .map(
            (photo) =>
              `
            <img
              src="${photo.link}"
              alt="photo"
              style="width: 100%; height: 100%; object-fit: cover"
            />
          `,
          )
          .join('')}
        </div>
        `,
      },
      {
        code: codeUserMatched,
        type: NOTIFICATION_MATCHED_TYPE,
        title: 'You have a new match',
        message: `
        <span>You have a new match with <strong>${user.firstName} ${
          user.lastName
        }</strong>. <a href=${
          this.configService.get('clientURL') + '/messages/' + conversationId
        }>Say hello right now! 😍</a></span>
        <div class="mt-4 grid grid-cols-3 grid-rows-${
          userPhotos?.length > 3 ? 2 : 1
        } gap-5">
        ${userPhotos
          .map(
            (photo) =>
              `
            <img
              src="${photo.link}"
              alt="photo"
              style="width: 100%; height: 100%; object-fit: cover"
            />
          `,
          )
          .join('')}
        </div>
        `,
      },
    ];

    const notificationsCreated = await this.notificationModel.insertMany(
      notifications,
    );

    return this.notificationObjectService.createMany([
      {
        notification: notificationsCreated[0]._id,
        recipient: user._id,
      },
      {
        notification: notificationsCreated[1]?._id,
        recipient: userMatched._id,
      },
    ]);
  }

  async active(id: string) {
    const notificationUpdated = await this.notificationModel.findByIdAndUpdate(
      id,
      { status: ACTIVE, deletable: false },
      { new: true },
    );

    await this.notificationObjectService.updateStatusByNotificationId(
      notificationUpdated._id,
    );

    const notificationObjects = await this.notificationObjectService.getByNotificationId(
      notificationUpdated._id,
    );

    const recipientIds = notificationObjects.map((notificationObject) =>
      notificationObject.recipient.toString(),
    );

    return { notification: notificationUpdated, recipientIds };
  }

  inActive(id: string) {
    return this.notificationModel.findByIdAndUpdate(id, { status: INACTIVE });
  }

  delete(id: string) {
    return this.notificationModel.deleteOne({ _id: id });
  }
}
