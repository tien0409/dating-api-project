import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/modules/base/base.repository';
import { Message, MessageDocument } from '../schemas/message.schema';

@Injectable()
export class MessageRepository extends BaseRepository<MessageDocument> {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {
    super(messageModel);
  }
}
