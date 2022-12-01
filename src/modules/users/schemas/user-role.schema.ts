import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';

export type UserRoleDocument = UserRole & Document;

@Schema({
  toJSON: { virtuals: true },
})
export class UserRole extends BaseSchema {
  @Prop({ required: true, unique: true })
  roleName: string;

  @Prop()
  roleDescription?: string;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
