import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export type UserMatchDocument = UserMatch & Document;

export const UserMatchStatusEnum = ['pending', 'accepted', 'rejected'];

export const UserMatchTypeEnum = ['like', 'dislike', 'super-like'];

@Schema({
  collection: 'user-matches',
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
  toObject: {
    virtuals: true,
  },
})
export class UserMatch extends BaseSchema {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userMatch: Types.ObjectId;

  @Prop({ default: 'pending', enum: UserMatchStatusEnum })
  status: string;

  @Prop({ required: true, enum: UserMatchTypeEnum })
  type: string;

  @Prop()
  matchedAt?: Date;
}

export const UserMatchSchema = SchemaFactory.createForClass(UserMatch);
