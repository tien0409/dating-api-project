import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  MessageAttachment,
  MessageAttachmentDocument,
} from './message-attachment.schema';
import { CreateMessageAttachmentDTO } from './dtos/create-message-attachment.dto';

@Injectable()
export class MessageAttachmentService {
  constructor(
    @InjectModel(MessageAttachment.name)
    private readonly messageAttachmentModel: Model<MessageAttachmentDocument>,
  ) {}

  createMany(createMessageAttachmentDTO: CreateMessageAttachmentDTO[]) {
    return this.messageAttachmentModel.insertMany(createMessageAttachmentDTO);
  }
}
