import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { emailRegex } from 'src/utils/regexes';

export type UserLoginDocument = UserLogin & Document;

@Schema({
  collection: 'user-logins',
  toJSON: { virtuals: true },
})
export class UserLogin extends BaseSchema {
  @Prop({ required: true, unique: true, match: emailRegex })
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ unique: true })
  confirmationCode?: string;

  @Prop({ default: null })
  confirmationTime?: Date;

  @Prop()
  refreshToken?: string;
}

export const UserLoginSchema = SchemaFactory.createForClass(UserLogin);

UserLoginSchema.set('toJSON', {
  transform: (doc, ret, opt) => {
    ret.id = ret._id;

    delete ret.password;
    delete ret._id;
    return ret;
  },
});
