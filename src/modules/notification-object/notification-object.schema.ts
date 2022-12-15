import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

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
  receiver: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Notification',
    required: true,
  })
  notification: Types.ObjectId;
}

export const NotificationObjectSchema = SchemaFactory.createForClass(
  NotificationObject,
);
