import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export const HIGH_SCHOOL = 'high_school';
export const TRADE_TECH_SCHOOL = 'trade_tech_school';
export const IN_COLLEGE = 'in_college';
export const UNDERGRADUATE_DEGREE = 'undergraduate_degree';
export const IN_GRAD_SCHOOL = 'in_grad_school';
export const GRADUATE_DEGREE = 'graduate_degree';

export const EDUCATION_LEVELS = [
  HIGH_SCHOOL,
  TRADE_TECH_SCHOOL,
  IN_COLLEGE,
  UNDERGRADUATE_DEGREE,
  IN_GRAD_SCHOOL,
  GRADUATE_DEGREE,
];

export const FREQUENTLY = 'Frequently';
export const SOCIALLY = 'Socially';
export const RARELY = 'Rarely';
export const NEVER = 'Never';
export const SOBER = 'Sober';
export const Regularly = 'Regularly';
export const ACTIVE = 'Active';
export const ALMOST_NEVER = 'Allmost never';

export const FREQUENCY_OF_DRINKING = [
  FREQUENTLY,
  SOCIALLY,
  RARELY,
  NEVER,
  SOBER,
];

export const FREQUENCY_OF_EXERCISE = [ACTIVE, ALMOST_NEVER, Regularly];

export const FREQUENCY_OF_SMOKING = [SOCIALLY, NEVER, Regularly];

export const WANT_SOME_DAY = 'Want someday';
export const DONT_WANT = 'Dont want';
export const HAVE_AND_WANT_MORE = 'Have and want more';
export const HAVE_AND_DONT_WANT_MORE = 'Have and dont want more';
export const NOT_SURE = 'Not sure';
export const PLAN_TO_HAVE_CHILDREN = [
  WANT_SOME_DAY,
  DONT_WANT,
  HAVE_AND_WANT_MORE,
  HAVE_AND_DONT_WANT_MORE,
  NOT_SURE,
];

export type UserPreferenceDocument = UserPreference & Document;

@Schema({
  collection: 'user-preferences',
  timestamps: true,
  toJSON: {
    transform: true,
    virtuals: true,
    getters: true,
  },
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class UserPreference extends BaseSchema {
  @Prop({
    required: true,
    ref: 'User',
    type: SchemaTypes.ObjectId,
    unique: true,
  })
  user: Types.ObjectId;

  @Prop({ type: Object, default: [] })
  age?: number[];

  @Prop({ type: Object, default: [] })
  height?: number[];

  @Prop({ enum: PLAN_TO_HAVE_CHILDREN })
  children?: string;

  @Prop({ enum: EDUCATION_LEVELS })
  educationLevel?: string;

  @Prop({ enum: FREQUENCY_OF_EXERCISE })
  exercise?: string;

  @Prop({ enum: FREQUENCY_OF_DRINKING })
  drinking?: string;

  @Prop({ enum: FREQUENCY_OF_SMOKING })
  smoking?: string;

  @Prop()
  passions?: string[];
}

export const UserPreferenceSchema = SchemaFactory.createForClass(
  UserPreference,
);
