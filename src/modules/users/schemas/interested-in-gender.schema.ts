import { Prop, Schema } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { Types } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { Gender } from '../../genders/gender.schema';
import { User } from './user.schema';

@Schema({
  collection: 'interested-in-genders',
})
export class InterestedInGender extends BaseSchema {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Gender.name })
  @Type(() => Gender)
  gender: Types.ObjectId;
}
