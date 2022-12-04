import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';

export type AddressDocument = Address & Document;

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
export class Address {
  @Prop({ required: true })
  city?: string;

  @Prop()
  detail?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
