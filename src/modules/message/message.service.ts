import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MessageDeleteDTO } from './dtos/message-delete.dto';
import { Message, MessageDocument } from './message.schema';
import { GetMessagesDTO } from './dtos/get-messages.dto';
import { ParticipantService } from '../participant/participant.service';
import { CreateMessageDTO } from './dtos/create-message.dto';
import { ConversationService } from '../conversation/conversation.service';
import { UpdateLastMessageDTO } from '../conversation/dtos/update-last-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly participantService: ParticipantService,
    private readonly conversationService: ConversationService,
  ) {}

  async getMessages(userId: string, getMessagesDTO: GetMessagesDTO) {
    const { conversationId } = getMessagesDTO;

    const participants = await this.participantService.getByConversationId(
      conversationId,
    );

    const messages = await this.messageModel
      .find()
      .populate({
        path: 'participant',
        populate: 'user',
      })
      .find({
        conversation: getMessagesDTO.conversationId,
        active: true,
      });

    const receiverParticipant = participants.find(
      (participant) => participant.user?._id?.toString() !== userId.toString(),
    );

    const senderParticipant = participants.find(
      (participant) => participant.user?._id?.toString() === userId.toString(),
    );

    return { messages, receiverParticipant, senderParticipant };
  }

  getMessagesByConversationId(conversationId: string) {
    return this.messageModel
      .find()
      .populate({
        path: 'participant',
        populate: 'user',
      })
      .find({
        conversation: conversationId,
        active: true,
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

  deleteMessage(messageDeleteDTO: MessageDeleteDTO) {
    const { message } = messageDeleteDTO;

    return this.messageModel.updateOne(
      {
        _id: message.id,
      },
      {
        $set: { active: false },
      },
    );
  }
}
