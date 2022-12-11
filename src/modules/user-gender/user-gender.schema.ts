import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export type UserGenderDocument = UserGender & Document;

@Schema({
  collection: 'user-genders',
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
export class UserGender extends BaseSchema {
  @Prop({ default: false })
  isPrivacy: boolean;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    autopopulate: true,
  })
  user: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Gender', autopopulate: true })
  showMeInSearchesAs?: Types.ObjectId;
}

export const UserGenderSchema = SchemaFactory.createForClass(UserGender);
