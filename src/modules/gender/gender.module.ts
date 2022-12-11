import { Module } from '@nestjs/common';
import { GenderService } from './gender.service';
import { GenderController } from './gender.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gender, GenderSchema } from './gender.schema';

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
  controllers: [GenderController],
})
export class GenderModule {}
