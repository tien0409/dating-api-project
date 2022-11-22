import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';

export type GenderDocument = Gender & Document;

export class Gender extends BaseSchema {
  @Prop({ required: true, unique: true })
  name: string;
}

export const GenderSchema = SchemaFactory.createForClass(Gender);

GenderSchema.virtual('interestedInGender', {
  ref: 'InterestedInGender',
  localField: '_id',
  foreignField: 'gender',
});
