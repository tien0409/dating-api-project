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

  @Prop({ maxlength: 15 })
  username?: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  bio?: string;

  @Prop({ unique: true })
  confirmationCode?: string;

  @Prop({ default: null })
  confirmationTime?: Date;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', {
  transform: (doc, ret, opt) => {
    ret.id = ret._id;
    delete ret.password;
    delete ret._id;
    return ret;
  },
});
