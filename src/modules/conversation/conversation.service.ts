import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Conversation, ConversationDocument } from './conversation.schema';
import { UpdateLastMessageDTO } from './dtos/update-last-message.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
  ) {}

  getById(conversationId: string) {
    return this.conversationModel.findById(conversationId);
  }

  getConversations(userId: string) {
    return this.conversationModel
      .find({
        participants: [{ user: userId }],
      })
      .populate({
        path: 'participants',
        populate: {
          path: 'user',
        },
        match: { user: { $ne: { _id: userId } } },
      })
      .populate('lastMessage');
  }

  updateLastMessage(updateLastMessageDTO: UpdateLastMessageDTO) {
    const { conversationId, lastMessage } = updateLastMessageDTO;

    return this.conversationModel.updateOne(
      { _id: conversationId },
      {
        lastMessage: lastMessage,
      },
    );
  }
}
