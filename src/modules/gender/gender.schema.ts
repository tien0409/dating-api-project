import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export type GenderDocument = Gender & Document;

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
export class Gender extends BaseSchema {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  describe?: string;
}

export const GenderSchema = SchemaFactory.createForClass(Gender);
