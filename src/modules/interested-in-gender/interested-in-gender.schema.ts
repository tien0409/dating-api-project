import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { Gender } from '../gender/gender.schema';
import { User } from '../users/schemas/user.schema';

export type InterestedInGenderDocument = InterestedInGender & Document;

@Schema({
  collection: 'interested-in-gender',
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    getters: true,
  },
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class InterestedInGender extends BaseSchema {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, autopopulate: true })
  @Type(() => User)
  user: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Gender.name, autopopulate: true })
  gender: Types.ObjectId;
}

export const InterestedInGenderSchema = SchemaFactory.createForClass(
  InterestedInGender,
);
