import { Prop, Schema } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

export type BaseDocument = BaseSchema & Document;

@Schema()
export class BaseSchema {
  @Transform(({ value }) => value.toString())
  _id?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}
