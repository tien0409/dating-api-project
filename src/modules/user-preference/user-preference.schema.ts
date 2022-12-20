import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export type UserPreferenceDocument = UserPreference & Document;

@Schema({
  collection: "user-preferences",
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
  @Prop({ type: Object, default: { start: 18, end: 70 } })
  age: { start: number; end: number };

  @Prop({ type: Object, default: { start: 100, end: 220 } })
  height: { start: number; end: number };

  @Prop()
  children: boolean;

  @Prop()
  drinking: boolean;

  @Prop()
  smoking: boolean;

  @Prop()
  passions: string[];
}

export const UserPreferenceSchema = SchemaFactory.createForClass(
  UserPreference,
);
