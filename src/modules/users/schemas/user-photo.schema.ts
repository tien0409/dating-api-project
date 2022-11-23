import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { User } from './user.schema';

export type UserPhotoDocument = UserPhoto & Document;

@Schema()
export class UserPhoto extends BaseSchema {
  @Prop({ required: true })
  link?: string;

  @Prop({ required: true, default: true })
  active: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: Types.ObjectId;
}

export const UserPhotoSchema = SchemaFactory.createForClass(UserPhoto);
