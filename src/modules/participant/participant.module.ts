import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';
import { Participant, ParticipantSchema } from './participant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participant.name, schema: ParticipantSchema },
    ]),
  ],
  providers: [ParticipantService],
  controllers: [ParticipantController],
  exports: [ParticipantService],
})
export class ParticipantModule {}
