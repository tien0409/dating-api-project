import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';

export type RelationshipTypeDocument = RelationshipType & Document;

export class RelationshipType extends BaseSchema {
  @Prop({ required: true, unique: true })
  name?: string;
}

export const RelationshipTypeSchema =
  SchemaFactory.createForClass(RelationshipType);
