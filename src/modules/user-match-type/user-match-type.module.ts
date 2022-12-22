import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserMatchTypeService } from './user-match-type.service';
import { UserMatchType, UserMatchTypeSchema } from './user-match-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserMatchType.name, schema: UserMatchTypeSchema },
    ]),
  ],
  providers: [UserMatchTypeService],
})
export class UserMatchTypeModule {}
