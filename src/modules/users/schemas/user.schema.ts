import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document } from 'mongoose';

import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { Address, AddressSchema } from './address.schema';
import { Gender, GenderSchema } from '../../gender/gender.schema';
import { UserRole, UserRoleSchema } from './user-role.schema';
import { UserPhoto } from './user-photo.schema';
import { emailRegex } from '../../../utils/regexes';

export type UserDocument = User & Document;

@Schema({
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
export class User extends BaseSchema {
  fullName?: string;

  age?: number;

  @Prop({ required: true, unique: true, match: emailRegex })
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop()
  avatar?: string;

  @Prop({ unique: true })
  confirmationCode?: string;

  @Prop({ default: null })
  confirmationTime?: Date;

  @Prop()
  refreshToken?: string;

  @Prop({ maxlength: 20 })
  firstName?: string;

  @Prop({ maxlength: 15 })
  lastName?: string;

  @Prop()
  bio?: string;

  @Prop()
  birthday?: Date;

  @Prop({ type: UserRoleSchema, default: null })
  @Type(() => UserRole)
  role?: UserRole;

  @Prop({ type: GenderSchema, default: null })
  @Type(() => Gender)
  gender?: Gender;

  @Prop({ type: AddressSchema, default: null })
  @Type(() => Address)
  address?: Address;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('fullName').get(function (this: UserDocument) {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('age').get(function (this: UserDocument) {
  return this.birthday
    ? Math.floor((new Date().getTime() - this.birthday.getTime()) / 3.15576e10)
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
