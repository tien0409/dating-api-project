import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { emailRegex } from 'src/utils/regexes';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Type } from 'class-transformer';

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

  @Prop({ type: UserSchema })
  @Type(() => User)
  user: User;
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
