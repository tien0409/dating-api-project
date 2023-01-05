import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';
import { ACTIVE, INACTIVE } from '../../configs/constants.config';

export const NOTIFICATION_OBJECT_STATUS_ENUM = [ACTIVE, INACTIVE];

export type NotificationObjectDocument = NotificationObject & Document;

@Schema({
  collection: 'notification-objects',
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class NotificationObject extends BaseSchema {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  })
  recipient: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Notification',
    required: true,
  })
  notification: Types.ObjectId;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: INACTIVE, enum: NOTIFICATION_OBJECT_STATUS_ENUM })
  status: string;
}

export const NotificationObjectSchema = SchemaFactory.createForClass(
  NotificationObject,
);
