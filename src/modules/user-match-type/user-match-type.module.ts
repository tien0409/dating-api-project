import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserMatchTypeService } from './user-match-type.service';
import { UserMatchType, UserMatchTypeSchema } from './user-match-type.schema';
import { UserMatchTypeAdminController } from './user-match-type.admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserMatchType.name, schema: UserMatchTypeSchema },
    ]),
  ],
  providers: [UserMatchTypeService],
  controllers: [UserMatchTypeAdminController],
})
export class UserMatchTypeModule {}
