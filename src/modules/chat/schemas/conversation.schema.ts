import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { Participant } from './participant.schema';

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation extends BaseSchema {
  @Prop()
  timeStarted: Date;

  @Prop()
  timeClosed: Date;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: User.name })
  user: Types.ObjectId;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.virtual('participants', {
  ref: "Participant",
  localField: '_id',
  foreignField: 'conversation',
});
