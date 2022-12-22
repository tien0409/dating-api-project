import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export type UserMatchDocument = UserMatch & Document;

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

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserMatchStatus' })
  status: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserMatchType' })
  type: Types.ObjectId;

  @Prop()
  matchedAt: Date;
}

export const UserMatchSchema = SchemaFactory.createForClass(UserMatch);
