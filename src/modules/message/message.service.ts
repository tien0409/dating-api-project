import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Message, MessageDocument } from './message.schema';
import { CreateMessageDTO } from './dtos/create-message.dto';
import { ConversationService } from '../conversation/conversation.service';
import { UpdateLastMessageDTO } from '../conversation/dtos/update-last-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly conversationService: ConversationService,
  ) {}

  getMessagesByConversationId(conversationId: string) {
    return this.messageModel
      .find({
        active: true,
        conversation: conversationId,
      })
      .populate({
        path: 'participant',
        populate: 'user',
      });
  }

  async createMessage(createMessageDTO: CreateMessageDTO) {
    const { conversationId, content, replyTo, participant } = createMessageDTO;

    const message = await this.messageModel.create({
      content,
      replyTo,
      participant,
    });
    const newMessage = await this.messageModel
      .findById(message._id)
      .populate({ path: 'participant', populate: 'user' });

    const payload: UpdateLastMessageDTO = {
      conversationId: conversationId,
      lastMessage: newMessage,
    };
    await this.conversationService.updateLastMessage(payload);
    return newMessage;
  }

  deleteMessage(messageId: string) {
    return this.messageModel.findOneAndDelete(
      {
        _id: messageId,
      },
      {
        $set: {
          active: false,
        },
      },
    );
  }
}
