import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/modules/base/schemas/base.schema';

export type UserRoleDocument = UserRole & Document;

@Schema({
  collection: 'user-roles',
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
export class UserRole extends BaseSchema {
  @Prop({ required: true, unique: true })
  roleName: string;

  @Prop()
  roleDescription?: string;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
