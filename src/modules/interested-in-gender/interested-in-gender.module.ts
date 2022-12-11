import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InterestedInGenderService } from './interested-in-gender.service';
import { InterestedInGenderController } from './interested-in-gender.controller';
import {
  InterestedInGender,
  InterestedInGenderSchema,
} from './interested-in-gender.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InterestedInGender.name, schema: InterestedInGenderSchema },
    ]),
  ],
  providers: [InterestedInGenderService],
  controllers: [InterestedInGenderController],
  exports: [InterestedInGenderService],
})
export class InterestedInGenderModule {}
