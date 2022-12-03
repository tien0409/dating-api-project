import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { ReceiverDto } from './dtos/receiver.dto';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';

import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { Participant, ParticipantDocument } from './schemas/participant.schema';
import { SendMessageDTO } from './dtos/send-message.dto';
import { User } from '../users/schemas/user.schema';

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

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) throw new WsException('Invalid credentials.');

    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.authService.getUserLoginFromAuthenticationToken(
      authenticationToken,
    );

    if (!user) throw new UnauthorizedException('Invalid credentials.');
    return user;
  }

  getAllConversations(userId: string) {
    return this.conversationModel
      .find({
        participants: {
          $contains: {
            $elemMatch: { user: userId },
          },
        },
      })
      .populate({
        path: 'participants',
        populate: {
          path: 'userId',
        },
      });
  }

  async getAllMessages(userId: string, receiverDto: ReceiverDto) {
    const conversation = await this.conversationModel.findOne({
      type: 'private',
      participants: {
        $all: [
          { $elemMatch: { user: receiverDto.id } },
          { $elemMatch: { user: userId } },
        ],
      },
    });

    if (!conversation) {
      const newConversation = await this.conversationModel.create({});
      const participantsPayload: Participant[] = [
        {
          timeJoined: new Date(),
          conversationId: newConversation._id,
          userId: new Types.ObjectId(userId),
        },
        {
          timeJoined: new Date(),
          conversationId: newConversation._id,
          userId: new Types.ObjectId(receiverDto.id),
        },
      ];
      await this.participantModel.insertMany(participantsPayload);

      return [];
    }

    return this.messageModel.find({ conversation: conversation._id });
  }

  async saveMessage(userId: string, sendMessageDto: SendMessageDTO) {
    const participant = await this.participantModel.findOne({ userId });
    const message = await this.messageModel.create({
      conversationId: new Types.ObjectId(sendMessageDto.conversationId),
      participantId: participant._id,
      content: sendMessageDto.content,
    });
    return message;
  }
}
