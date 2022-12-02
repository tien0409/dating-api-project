import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

export type BaseDocument = BaseSchema & Document;

@Schema({
  toJSON: { virtuals: true, transform: true },
  toObject: { virtuals: true },
})
export class BaseSchema {
  @Transform(({ value }) => value.toString())
  _id?: string;

  id?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

const _BaseSchema = SchemaFactory.createForClass(BaseSchema);

_BaseSchema.set('toJSON', {
  transform: (doc, ret, opt) => {
    ret.id = ret._id;

    delete ret._id;
    delete ret._v;
    return ret;
  },
});
