import { Module } from '@nestjs/common';
import { GendersController } from './genders.controller';
import { GendersService } from './genders.service';
import { GendersRepository } from './gender.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Gender, GenderSchema } from './gender.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gender.name, schema: GenderSchema }]),
  ],
  controllers: [GendersController],
  providers: [GendersService, GendersRepository],
})
export class GendersModule {}
