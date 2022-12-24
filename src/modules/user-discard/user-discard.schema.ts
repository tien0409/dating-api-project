import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export type UserDiscardDocument = UserDiscard & Document;

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
export class UserDiscard extends BaseSchema {
  @Prop({ required: true, ref: 'User', type: SchemaTypes.ObjectId })
  user: Types.ObjectId;

  @Prop({ required: true, ref: 'User', type: SchemaTypes.ObjectId })
  user_discarded: Types.ObjectId;
}

export const UserDiscardSchema = SchemaFactory.createForClass(UserDiscard);
