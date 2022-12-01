import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { Address, AddressSchema } from './address.schema';
import { Gender, GenderSchema } from './gender.schema';
import { UserLogin, UserLoginSchema } from './user-login.schema';

export type UserDocument = User & Document;

@Schema({
  toJSON: { virtuals: true },
})
export class User extends BaseSchema {
  @Prop({ maxlength: 20 })
  firstName?: string;

  @Prop({ maxlength: 15 })
  lastName?: string;

  fullName: string;

  @Prop()
  bio?: string;

  @Prop()
  birthday?: Date;

  age?: number;

  @Prop({ type: UserLoginSchema })
  @Type(() => UserLogin)
  userLogin: UserLogin;

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

UserSchema.virtual('age').get(function (this: UserDocument) {
  return this.birthday
    ? Math.floor((Date.now() - this.birthday.getTime()) / 3.15576e10)
    : null;
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
    ret.age = Date.now() - ret.birthday?.getTime();

    delete ret.password;
    delete ret._id;
    delete ret.dob;
    return ret;
  },
});
