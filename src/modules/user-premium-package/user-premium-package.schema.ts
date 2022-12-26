import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

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
  user: Types.ObjectId;

  @Prop({ required: true, ref: 'PremiumPackage', type: SchemaTypes.ObjectId })
  premiumPackage: Types.ObjectId;

  @Prop({ required: true })
  purchaseDate: Date;
}

export const UserPremiumPackageSchema = SchemaFactory.createForClass(
  UserPremiumPackage,
);

UserPremiumPackageSchema.index(
  { user: 1, premiumPackage: 1 },
  { unique: true },
);
