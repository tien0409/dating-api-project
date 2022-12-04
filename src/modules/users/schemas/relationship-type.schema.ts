import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';

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
export class RelationshipType {
  @Prop({ required: true, unique: true })
  name?: string;
}

export const RelationshipTypeSchema =
  SchemaFactory.createForClass(RelationshipType);

RelationshipTypeSchema.virtual('interestedInRelations', {
  ref: 'InterestedInRelation',
  localField: '_id',
  foreignField: 'relationshipType',
});
