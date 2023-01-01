import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export type PremiumPackageDocument = PremiumPackage & Document;

@Schema({
  collection: 'premium-packages',
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
  toObject: {
    virtuals: true,
  },
})
export class PremiumPackage extends BaseSchema {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({
    required: true,
    unique: true,
    validators: [(v) => v > 12 || v < 0, '{PATH} is between 0 and 12'],
  })
  numberOfMonths: number;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: false })
  active: boolean;

  @Prop({ default: true })
  deletable: boolean;
}

export const PremiumPackageSchema = SchemaFactory.createForClass(
  PremiumPackage,
);
