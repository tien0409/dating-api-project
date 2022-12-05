import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { Participant } from '../participant/participant.schema';
import { Message } from '../message/message.schema';

export type ConversationDocument = Conversation & Document;

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
export class Conversation extends BaseSchema {
  participants?: Participant[];

  @Prop()
  timeStarted: Date;

  @Prop()
  timeClosed: Date;

  @Prop({ enum: ['private', 'group'], default: 'private' })
  type: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Message' })
  lastMessage?: Types.ObjectId;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.virtual('participants', {
  ref: 'Participant',
  localField: '_id',
  foreignField: 'conversation',
});
