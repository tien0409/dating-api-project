import { Module } from '@nestjs/common';
import { MessageAttachmentService } from './message-attachment.service';
import { MessageAttachmentController } from './message-attachment.controller';

@Module({
  providers: [MessageAttachmentService],
  controllers: [MessageAttachmentController]
})
export class MessageAttachmentModule {}
