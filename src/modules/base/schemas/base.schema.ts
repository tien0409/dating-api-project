import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BaseDocument = BaseSchema & Document;

@Schema()
export class BaseSchema {
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}
