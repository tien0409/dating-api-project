import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { Types } from 'mongoose';

import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { Gender } from '../../gender/gender.schema';
import { RelationshipType } from '../../relationship-type/relationship-type.schema';
import { User } from './user.schema';

@Schema({
  collection: 'interested-in-relations',
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
export class InterestedInRelation extends BaseSchema {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: RelationshipType.name })
  @Type(() => Gender)
  relationshipType: Types.ObjectId;
}
