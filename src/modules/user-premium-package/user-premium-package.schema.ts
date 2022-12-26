import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';
import { PremiumPackage } from '../premium-package/premium-package.schema';
import { User } from '../users/schemas/user.schema';

export type UserPremiumPackageDocument = UserPremiumPackage & Document;

@Schema({
  collection: 'user-premium-packages',
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
  toObject: {
    virtuals: true,
  },
})
export class UserPremiumPackage extends BaseSchema {
  @Prop({ required: true, ref: 'User', type: SchemaTypes.ObjectId })
  user: User;

  @Prop({ required: true, ref: 'PremiumPackage', type: SchemaTypes.ObjectId })
  premiumPackage: PremiumPackage;

  @Prop({ required: true })
  purchaseDate: Date;
}

export const UserPremiumPackageSchema = SchemaFactory.createForClass(
  UserPremiumPackage,
);
