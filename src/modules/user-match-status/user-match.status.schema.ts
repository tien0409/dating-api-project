import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export type UserMatchStatusDocument = UserMatchStatus & Document;

@Schema({
  collection: 'user-match-statuses',
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
  toObject: {
    virtuals: true,
  },
})
export class UserMatchStatus extends BaseSchema {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  bgColor: string;
}

export const UserMatchStatusSchema = SchemaFactory.createForClass(
  UserMatchStatus,
);
