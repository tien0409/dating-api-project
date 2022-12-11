import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type GenderDocument = Gender & Document;

@Schema({
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
export class Gender {
  @Prop({ required: true })
  name: string;

  @Prop()
  describe?: string;

  @Prop({ default: false })
  isPrivacy: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: Gender.name, autopopulate: true })
  showMeInSearchesAs?: Types.ObjectId;
}

export const GenderSchema = SchemaFactory.createForClass(Gender);

GenderSchema.virtual('interestedInGenders', {
  ref: 'InterestedInGender',
  localField: '_id',
  foreignField: 'gender',
});
