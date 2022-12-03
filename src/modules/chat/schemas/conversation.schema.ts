import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaType, SchemaTypes } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { Participant } from './participant.schema';
import { Message, MessageSchema } from './message.schema';

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
  participants?: Participant[];

  @Prop()
  timeStarted: Date;

  @Prop()
  timeClosed: Date;

  @Prop({ enum: ['private', 'group'], default: 'private' })
  type: string;

  @Prop({ type: SchemaTypes.ObjectId, schema: MessageSchema })
  lastMessage?: Message;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.virtual('participants', {
  ref: 'Participant',
  localField: '_id',
  foreignField: 'conversation',
});
