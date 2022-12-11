import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserGenderService } from './user-gender.service';
import { UserGenderController } from './user-gender.controller';
import { UserGender, UserGenderSchema } from './user-gender.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserGender.name, schema: UserGenderSchema },
    ]),
  ],
  providers: [UserGenderService],
  controllers: [UserGenderController],
  exports: [UserGenderService],
})
export class UserGenderModule {}
