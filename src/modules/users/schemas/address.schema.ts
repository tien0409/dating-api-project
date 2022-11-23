import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';

export type AddressDocument = Address & Document;

@Schema()
export class Address extends BaseSchema {
  @Prop({ required: true })
  city?: string;

  @Prop()
  detail?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
