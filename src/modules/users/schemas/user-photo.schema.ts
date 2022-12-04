import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, SchemaTypes, Types } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { User } from './user.schema';

export type UserPhotoDocument = UserPhoto & Document;

@Schema({
  collection: 'user-photos',
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
export class UserPhoto {
  @Prop({ required: true })
  link?: string;

  @Prop({ required: true, default: true })
  active?: boolean;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;
}

export const UserPhotoSchema = SchemaFactory.createForClass(UserPhoto);
