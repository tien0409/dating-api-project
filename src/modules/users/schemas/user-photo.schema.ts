import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
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
    ref: 'User',
    required: true,
  })
  @Type(() => User)
  user: User;
}

export const UserPhotoSchema = SchemaFactory.createForClass(UserPhoto);
