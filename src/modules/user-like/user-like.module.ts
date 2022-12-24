import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserLikeController } from './user-like.controller';
import { UserLikeService } from './user-like.service';
import { UserLike, UserLikeSchema } from './user-like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserLike.name, schema: UserLikeSchema },
    ]),
  ],
  controllers: [UserLikeController],
  providers: [UserLikeService],
  exports: [UserLikeService],
})
export class UserLikeModule {}
