import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { Participant } from './participant.schema';

@Schema()
export class Message extends BaseSchema {
  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isEdited: boolean;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Participant.name })
  participant: Types.ObjectId;
}
