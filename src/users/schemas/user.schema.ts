import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/base/schemas/base.schema';

export type UserDocument = User & Document;

@Schema()
export class User extends BaseSchema {
  @Prop({ required: true, minlength: 4, maxlength: 12 })
  username: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
