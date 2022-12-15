import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';

export type RoleDocument = Role & Document;

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
export class Role extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
