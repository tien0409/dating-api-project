import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserMatchStatusService } from './user-match-status.service';
import {
  UserMatchStatus,
  UserMatchStatusSchema,
} from './user-match.status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserMatchStatus.name, schema: UserMatchStatusSchema },
    ]),
  ],
  providers: [UserMatchStatusService],
})
export class UserMatchStatusModule {}
