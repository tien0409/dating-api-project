import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { Participant } from '../participant/participant.schema';
import { MessageAttachment } from '../message-attachment/message-attachment.schema';

export type MessageDocument = Message & Document;

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
export class Message extends BaseSchema {
  @Type(() => MessageAttachment)
  attachments?: MessageAttachment[];

  @Prop({
    transform: (v) => v.trim(),
  })
  content: string;

  @Prop({ default: false })
  isEdited?: boolean;

  @Prop({ default: true })
  active?: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: Message.name, autopopulate: true })
  replyTo?: Types.ObjectId;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: Participant.name,
    autopopulate: true,
  })
  participant: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.virtual('attachments', {
  ref: 'MessageAttachment',
  localField: '_id',
  foreignField: 'message',
});
