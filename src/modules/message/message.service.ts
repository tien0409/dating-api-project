import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Message, MessageDocument } from './message.schema';
import { CreateMessageDTO } from './dtos/create-message.dto';
import { ConversationService } from '../conversation/conversation.service';
import { UpdateMessageDTO } from './dtos/update-message.dto';
import { ParticipantService } from '../participant/participant.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly conversationService: ConversationService,
    private readonly participantService: ParticipantService,
  ) {}

  async getMessagesByConversationIdAndUserId(
    conversationId: string,
    userId: string,
  ) {
    const userParticipant = await this.participantService.getByUserId(userId);

    return this.messageModel
      .find({
        active: true,
        conversation: conversationId,
        createdAt: { $gte: userParticipant.timeJoined },
      })
      .populate({
        path: 'participant',
        populate: 'user',
      });
  }

  async createMessage(createMessageDTO: CreateMessageDTO) {
    const {
      conversationId,
      content,
      replyTo,
      senderParticipantId,
    } = createMessageDTO;

    // note: update time joined another participant before create message
    const updateParticipantTimeJoined = await this.participantService.updateManyTimeJoined(
      { conversationId },
    );

    const message = await this.messageModel.create({
      content,
      replyTo,
      participant: senderParticipantId,
    });

    const newMessage = await this.messageModel
      .findById(message._id)
      .populate({ path: 'participant', populate: 'user' });

    const conversationUpdateLastMessage = await this.conversationService.updateLastMessage(
      {
        conversationId: conversationId,
        lastMessage: newMessage,
      },
    );

    return { newMessage, conversationUpdated: conversationUpdateLastMessage };
  }

  updateMessage(updateMessageDTO: UpdateMessageDTO) {
    const { messageId, content } = updateMessageDTO;

    return this.messageModel.findOneAndUpdate(
      { _id: messageId },
      {
        $set: {
          content,
        },
      },
      { new: true },
    );
  }

  deleteMessage(messageId: string) {
    return this.messageModel.updateOne(
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
