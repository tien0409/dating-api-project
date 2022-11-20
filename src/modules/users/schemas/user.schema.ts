import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { emailRegex } from 'src/utils/regexes';

export type UserDocument = User & Document;

@Schema()
export class User extends BaseSchema {
  @Prop({ required: true, unique: true, match: emailRegex })
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', {
  transform: (doc, ret, opt) => {
    delete ret.password;
    return ret;
  },
});
