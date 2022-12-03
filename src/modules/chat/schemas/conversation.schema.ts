import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type ConversationDocument = Conversation & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Conversation extends BaseSchema {
  @Prop()
  timeStarted: Date;

  @Prop()
  timeClosed: Date;

  @Prop({ enum: ['private', 'group'], default: 'private' })
  type: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.virtual('participants', {
  ref: 'Participant',
  localField: '_id',
  foreignField: 'conversationId',
});

ConversationSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'conversationId',
});
