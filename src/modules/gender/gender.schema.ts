import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';
import { UserGender } from '../user-gender/user-gender.schema';

export type GenderDocument = Gender & Document;

@Schema({
  timestamps: true,
  toJSON: {
    versionKey: false,
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Gender extends BaseSchema {
  @Prop({
    required: true,
    unique: true,
  })
  code: string;

  @Type(() => UserGender)
  userGenders: UserGender[];

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;
}

export const GenderSchema = SchemaFactory.createForClass(Gender);

GenderSchema.virtual('userGenders', {
  ref: 'UserGender',
  localField: '_id',
  foreignField: 'gender',
  count: true,
});
