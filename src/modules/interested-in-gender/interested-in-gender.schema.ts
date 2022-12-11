import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { Types } from 'mongoose';

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
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Gender.name })
  @Type(() => Gender)
  gender: Types.ObjectId;
}

export const InterestedInGenderSchema = SchemaFactory.createForClass(
  InterestedInGender,
);
