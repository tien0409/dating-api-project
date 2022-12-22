import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export type UserMatchTypeDocument = UserMatchType & Document;

@Schema({
  collection: 'user-match-types',
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
  toObject: {
    virtuals: true,
  },
})
export class UserMatchType extends BaseSchema {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  bgColor: string;
}

export const UserMatchTypeSchema = SchemaFactory.createForClass(UserMatchType);
