import { Notification } from '../../notification/notification.schema';

export type CreateNotificationPayload = {
  notification: Notification;
  recipientIds: string[];
};
