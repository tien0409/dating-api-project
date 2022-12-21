import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export type PassionDocument = Passion & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
  toObject: {
    virtuals: true,
  },
})
export class Passion extends BaseSchema {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: '#F8F9FF', transform: (v) => v.toUpperCase() })
  bgColor: string;

  @Prop({ default: '#525176', transform: (v) => v.toUpperCase() })
  fgColor: string;

  @Prop({ default: '#EAEAEB', transform: (v) => v.toUpperCase() })
  borderColor: string;

  @Prop()
  description?: string;
}

export const PassionSchema = SchemaFactory.createForClass(Passion);
