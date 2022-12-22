import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserMatchService } from './user-match.service';
import { UserMatchController } from './user-match.controller';
import { UserMatch, UserMatchSchema } from './user-match.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserMatch.name, schema: UserMatchSchema },
    ]),
  ],
  providers: [UserMatchService],
  controllers: [UserMatchController],
})
export class UserMatchModule {}
