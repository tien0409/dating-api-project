import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { Address } from './address.schema';
import { Role } from '../../role/role.schema';
import { UserPhoto } from './user-photo.schema';
import { emailRegex } from '../../../utils/regexes';
import { UserGender } from '../../user-gender/user-gender.schema';
import { Type } from 'class-transformer';
import { UserMatch } from '../../user-match/user-match.schema';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: true,
    virtuals: true,
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

  @Type(() => UserPhoto)
  photos: UserPhoto[];

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

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: 'Passion',
    validators: [(v) => v.length <= 5, '{PATH} exceeds the limit of 5'],
  })
  passions: Types.ObjectId[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Role', autopopulate: true })
  role?: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: UserGender.name,
    autopopulate: true,
  })
  userGender?: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'RelationshipType',
    default: null,
  })
  relationshipType?: Types.ObjectId;

  @Prop()
  stripeCustomerId?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Address.name, autopopulate: true })
  address?: Types.ObjectId;
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

UserSchema.virtual('userSendMatches', {
  ref: 'UserMatch',
  localField: '_id',
  foreignField: 'user',
});

UserSchema.virtual('userReceiveMatches', {
  ref: 'UserMatch',
  localField: '_id',
  foreignField: 'userMatch',
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
  transform: function (doc: any, ret: any, options: any) {
    delete ret.password;
    delete ret.confirmationCode;
    delete ret.confirmationTime;
    return ret;
  },
  virtuals: true,
});
