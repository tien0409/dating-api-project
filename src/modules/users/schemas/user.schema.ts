import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { emailRegex } from 'src/utils/regexes';
import { Address, AddressSchema } from './address.schema';
import { Gender, GenderSchema } from './gender.schema';

export type UserDocument = User & Document;

@Schema({
  toJSON: { virtuals: true },
})
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

  fullName: string;

  @Prop()
  bio?: string;

  @Prop()
  dob?: Date;

  @Prop({ unique: true })
  confirmationCode?: string;

  @Prop({ default: null })
  confirmationTime?: Date;

  @Prop()
  refreshToken?: string;

  @Prop({ type: GenderSchema })
  @Type(() => Gender)
  gender: Gender;

  @Prop({ type: AddressSchema })
  @Type(() => Address)
  address: Address;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('fullName').get(function (this: UserDocument) {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('photos', {
  ref: 'UserPhoto',
  localField: '_id',
  foreignField: 'user',
});

UserSchema.virtual('interestedInGenders', {
  ref: 'InterestedInGender',
  localField: '_id',
  foreignField: 'user',
});

UserSchema.virtual('interestedInRelations', {
  ref: 'InterestedInRelation',
  localField: '_id',
  foreignField: 'user',
});

UserSchema.virtual('conversations', {
  ref: 'Conversation',
  localField: '_id',
  foreignField: 'user',
});

UserSchema.virtual('participants', {
  ref: 'Participant',
  localField: '_id',
  foreignField: 'user',
});

UserSchema.set('toJSON', {
  transform: (doc, ret, opt) => {
    ret.id = ret._id;
    ret.age = Date.now() - ret.dob.getTime();

    delete ret.password;
    delete ret._id;
    delete ret.dob;
    return ret;
  },
});
