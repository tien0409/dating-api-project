import { SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from 'src/modules/users/schemas/user.schema';
import { Conversation } from '../conversation/conversation.schema';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';

export type ParticipantDocument = Participant & Document;

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
export class Participant extends BaseSchema {
  @Prop({ required: true })
  timeJoined: Date;

  @Prop()
  timeLeft?: Date;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: User.name,
    autopopulate: true,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: Conversation.name,
  })
  conversation: Types.ObjectId;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);

ParticipantSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'participant',
});
