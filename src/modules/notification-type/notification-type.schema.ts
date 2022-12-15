import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export type NotificationTypeDocument = NotificationType & Document;

@Schema({
  collection: 'notification-types',
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class NotificationType extends BaseSchema {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;
}

export const NotificationTypeSchema = SchemaFactory.createForClass(
  NotificationType,
);
