import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';
import { ACTIVE, INACTIVE } from '../../configs/constants.config';

export const NOTIFICATION_STATUS_ENUM = [ACTIVE, INACTIVE];

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
  sender: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: INACTIVE, enum: NOTIFICATION_STATUS_ENUM })
  status: string;

  @Prop({ required: true })
  message: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
