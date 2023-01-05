import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';
import { ACTIVE, INACTIVE } from '../../configs/constants.config';

export const NOTIFICATION_STATUS_ENUM = [ACTIVE, INACTIVE];

export const NOTIFICATION_MATCHED_TYPE = 'MATCHED';
export const NOTIFICATION_PAYMENT_TYPE = 'PAYMENT';
export const NOTIFICATION_SYSTEM_TYPE = 'SYSTEM';
export const NOTIFICATION_TYPE_ENUM = [
  NOTIFICATION_MATCHED_TYPE,
  NOTIFICATION_PAYMENT_TYPE,
  NOTIFICATION_SYSTEM_TYPE,
];

export type NotificationDocument = Notification & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Notification extends BaseSchema {
  @Prop()
  code: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  })
  sender?: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: INACTIVE, enum: NOTIFICATION_STATUS_ENUM })
  status: string;

  @Prop({ default: NOTIFICATION_SYSTEM_TYPE, enum: NOTIFICATION_TYPE_ENUM })
  type: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: true })
  deletable: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.virtual('notificationObjects', {
  ref: 'NotificationObject',
  localField: '_id',
  foreignField: 'notification',
});
