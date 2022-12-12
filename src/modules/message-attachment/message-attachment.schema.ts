import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { Message } from '../message/message.schema';

export type MessageAttachmentDocument = MessageAttachment & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
  toObject: {
    virtuals: true,
  },
})
export class MessageAttachment extends BaseSchema {
  @Prop({ required: true })
  link: string;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: Message.name,
    autopopulate: true,
  })
  message: Types.ObjectId;
}

export const MessageAttachmentSchema = SchemaFactory.createForClass(MessageAttachment);
