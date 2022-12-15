import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

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
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  })
  sender: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'NotificationType',
    required: true,
  })
  type: Types.ObjectId;

  @Prop({ required: true })
  message: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
