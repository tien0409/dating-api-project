import { Module } from '@nestjs/common';
import { BlockUserController } from './block-user.controller';
import { BlockUserService } from './block-user.service';

@Module({
  controllers: [BlockUserController],
  providers: [BlockUserService]
})
export class BlockUserModule {}
