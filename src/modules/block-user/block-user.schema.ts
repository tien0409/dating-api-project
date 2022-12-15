import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

import { BaseSchema } from '../base/schemas/base.schema';

export type BlockUserDocument = BlockUser & Document;

@Schema({
  collection: 'block-users',
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class BlockUser extends BaseSchema {
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: 'User',
    autopopulate: true,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: 'User',
    autopopulate: true,
  })
  userBlocked: Types.ObjectId;
}

export const BlockUserSchema = SchemaFactory.createForClass(BlockUser);
