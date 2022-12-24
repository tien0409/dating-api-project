import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export type UserMatchDocument = UserMatch & Document;

export const UserMatchLikeType = 'like';
export const UserMatchSuperType = 'super-like';
export const UserMatchTypeEnum = [UserMatchLikeType, UserMatchSuperType];

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
  userMatched: Types.ObjectId;

  @Prop({ required: true, enum: UserMatchTypeEnum })
  type: string;
}

export const UserMatchSchema = SchemaFactory.createForClass(UserMatch);

UserMatchSchema.index({ user: 1, userMatch: 1 }, { unique: true });
