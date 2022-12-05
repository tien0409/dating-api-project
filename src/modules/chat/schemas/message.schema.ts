import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { Participant } from './participant.schema';

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
  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isEdited?: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: Message.name })
  replyTo?: Types.ObjectId;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: Participant.name,
  })
  participant: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

const autoPopulateReplyTo = function (next) {
  this.populate('replyTo');
  next();
};

MessageSchema.pre('find', autoPopulateReplyTo).pre(
  'findOne',
  autoPopulateReplyTo,
);
