import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PassionController } from './passion.controller';
import { PassionService } from './passion.service';
import { Passion, PassionSchema } from './passion.schema';
import { PassionAdminController } from './passion.admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Passion.name, schema: PassionSchema }]),
  ],
  controllers: [PassionController, PassionAdminController],
  providers: [PassionService],
})
export class PassionModule {}
