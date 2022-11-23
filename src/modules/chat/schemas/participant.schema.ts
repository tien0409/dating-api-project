import { Conversation } from './conversation.schema';
import { Prop } from '@nestjs/mongoose/dist/decorators';
import { Types } from 'mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { SchemaFactory, Schema } from '@nestjs/mongoose';
import { Message } from './message.schema';

export type ParticipantDocument = Participant & Document;

@Schema()
export class Participant extends BaseSchema {
  @Prop({ required: true })
  timeJoined: Date;

  @Prop({ required: true })
  timeLeft: Date;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: User.name })
  user: Types.ObjectId;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Conversation.name })
  conversation: Types.ObjectId;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);

ParticipantSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'participant',
});
