import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GenderService } from './gender.service';
import { GenderController } from './gender.controller';
import { Gender, GenderSchema } from './gender.schema';
import { GenderAdminController } from './gender.admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Gender.name,
        schema: GenderSchema,
      },
    ]),
  ],
  providers: [GenderService],
  controllers: [GenderController, GenderAdminController],
})
export class GenderModule {}
