import { Prop } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { Types } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { Gender } from './gender.schema';
import { RelationshipType } from './relationship-type.schema';
import { User } from './user.schema';

export class InterestedInRelation extends BaseSchema {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: RelationshipType.name })
  @Type(() => Gender)
  relationshipType: Types.ObjectId;
}
