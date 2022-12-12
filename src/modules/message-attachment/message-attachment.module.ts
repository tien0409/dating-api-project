import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MessageAttachmentService } from './message-attachment.service';
import { MessageAttachmentController } from './message-attachment.controller';
import { MessageAttachmentSchema } from './message-attachment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MessageAttachment', schema: MessageAttachmentSchema },
    ]),
  ],
  providers: [MessageAttachmentService],
  controllers: [MessageAttachmentController],
  exports: [MessageAttachmentService],
})
export class MessageAttachmentModule {}
