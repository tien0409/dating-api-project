import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RelationshipTypeService } from './relationship-type.service';
import { RelationshipTypeController } from './relationship-type.controller';
import {
  RelationshipType,
  RelationshipTypeSchema,
} from './relationship-type.schema';
import { RelationshipTypeAdminController } from './relationship-type.admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RelationshipType.name, schema: RelationshipTypeSchema },
    ]),
  ],
  providers: [RelationshipTypeService],
  controllers: [RelationshipTypeController, RelationshipTypeAdminController],
})
export class RelationshipTypeModule {}
