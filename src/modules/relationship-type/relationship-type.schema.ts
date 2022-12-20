import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { User } from '../users/schemas/user.schema';
import { Type } from 'class-transformer';

export type RelationshipTypeDocument = RelationshipType & Document;

@Schema({
  collection: 'relationship-types',
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
export class RelationshipType extends BaseSchema {
  @Type(() => User)
  userRelationshipTypes: User[];

  @Prop({ required: true, unique: true })
  code?: string;

  @Prop({ required: true, unique: true })
  name?: string;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop()
  description?: string;
}

export const RelationshipTypeSchema = SchemaFactory.createForClass(
  RelationshipType,
);

RelationshipTypeSchema.virtual('userRelationshipTypes', {
  ref: '',
  localField: '_id',
  foreignField: 'relationshipType',
});
