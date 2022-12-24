import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export type UserLikeDocument = UserLike & Document;

@Schema({
  collection: 'user-likes',
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
  toObject: {
    virtuals: true,
  },
})
export class UserLike extends BaseSchema {
  @Prop({ required: true, ref: 'User', type: SchemaTypes.ObjectId })
  user: Types.ObjectId;

  @Prop({ required: true, ref: 'User', type: SchemaTypes.ObjectId })
  userLiked: Types.ObjectId;

  @Prop()
  likedAt: Date;
}

export const UserLikeSchema = SchemaFactory.createForClass(UserLike);

UserLikeSchema.index({ user: 1, userLiked: 1 }, { unique: true });
