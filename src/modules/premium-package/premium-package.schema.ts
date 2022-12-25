import { Prop, Schema } from '@nestjs/mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

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
  numberOfMonths: number;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: true })
  deletable: boolean;
}
