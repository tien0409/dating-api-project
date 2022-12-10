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
    const {
      conversationId,
      content,
      replyTo,
      senderParticipantId,
    } = createMessageDTO;

    const message = await this.messageModel.create({
      content,
      replyTo,
      participant: senderParticipantId,
    });
    const newMessage = await this.messageModel
      .findById(message._id)
      .populate({ path: 'participant', populate: 'user' });

    const conversationUpdateLastMessagePromise = this.conversationService.updateLastMessage(
      {
        conversationId: conversationId,
        lastMessage: newMessage,
      },
    );
    const updateParticipantTimeJoinedPromise = this.participantService.updateManyTimeJoined(
      { conversationId },
      senderParticipantId,
    );

    const [conversationUpdateLastMessage] = await Promise.all([
      conversationUpdateLastMessagePromise,
      updateParticipantTimeJoinedPromise,
    ]);
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
