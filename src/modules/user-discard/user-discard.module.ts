import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserDiscardService } from './user-discard.service';
import { UserDiscardController } from './user-discard.controller';
import { UserDiscard, UserDiscardSchema } from './user-discard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDiscard.name, schema: UserDiscardSchema },
    ]),
  ],
  providers: [UserDiscardService],
  controllers: [UserDiscardController],
})
export class UserDiscardModule {}
