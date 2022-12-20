import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RelationshipTypeService } from './relationship-type.service';
import { RelationshipTypeController } from './relationship-type.controller';
import {
  RelationshipType,
  RelationshipTypeSchema,
} from './relationship-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RelationshipType.name, schema: RelationshipTypeSchema },
    ]),
  ],
  providers: [RelationshipTypeService],
  controllers: [RelationshipTypeController],
})
export class RelationshipTypeModule {}
