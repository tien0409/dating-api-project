import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';
import { Participant } from './participant.schema';
import { Conversation } from './conversation.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message extends BaseSchema {
  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isEdited?: boolean;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Participant.name })
  participantId: Types.ObjectId;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Conversation.name })
  conversationId: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
