import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { ReceiverDTO } from './dtos/receiver.dto';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';

import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { Participant, ParticipantDocument } from './schemas/participant.schema';
import { SendMessageDTO } from './dtos/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
    @InjectModel(Participant.name)
    private readonly participantModel: Model<ParticipantDocument>,
  ) {}

  getAllConversations(userId: string) {
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

  async getAllMessages(userId: string, receiverDTO: ReceiverDTO) {
    const conversation = await this.conversationModel.findOne({
      type: 'private',
      participants: {
        $all: [
          { $elemMatch: { user: receiverDTO.id } },
          { $elemMatch: { user: userId } },
        ],
      },
    });

    if (!conversation) {
      const newConversation = await this.conversationModel.create({});
      const participantsPayload: Participant[] = [
        {
          timeJoined: new Date(),
          conversation: newConversation._id,
          user: new Types.ObjectId(userId),
        },
        {
          timeJoined: new Date(),
          conversation: newConversation._id,
          user: new Types.ObjectId(receiverDTO.id),
        },
      ];
      await this.participantModel.insertMany(participantsPayload);

      return [];
    }

    const participants = await this.participantModel.find({ conversation });

    return this.messageModel
      .find({
        $or: [
          { participant: participants[0]?._id },
          { participant: participants[1]?._id },
        ],
      })
      .populate({
        path: 'participant',
        populate: 'user',
      });
  }

  async saveMessage(userId: string, sendMessageDTO: SendMessageDTO) {
    const participant = await this.participantModel.findOne({ user: userId });
    const receiver = await this.participantModel.findOne({
      $and: [
        { conversation: sendMessageDTO.conversationId },
        { user: { $ne: userId } },
      ],
    });
    const newMessage = await this.messageModel.create({
      participant: participant._id,
      content: sendMessageDTO.content,
    });
    await this.conversationModel.updateOne({
      lastMessage: newMessage,
    });
    return { newMessage, receiver };
  }
}
