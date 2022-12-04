import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { Participant, ParticipantDocument } from './schemas/participant.schema';
import { SendMessageDTO } from './dtos/send-message.dto';
import { Message, MessageDocument } from './schemas/message.schema';
import { AuthService } from '../auth/auth.service';
import { ConversationDTO } from './dtos/conversation.dto';

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

  async getAllMessages(userId: string, conversationDTO: ConversationDTO) {
    const participants = await this.participantModel
      .find({
        conversation: conversationDTO.id,
      })
      .populate('user');

    const messages = await this.messageModel
      .find()
      .populate({
        path: 'participant',
        populate: 'user',
      })
      .find({
        conversation: conversationDTO.id,
      });

    const receiverParticipant = participants.find(
      (participant) => participant.user?._id?.toString() !== userId.toString(),
    );

    const senderParticipant = participants.find(
      (participant) => participant.user?._id?.toString() === userId.toString(),
    );

    return { messages, receiverParticipant, senderParticipant };

    // create conversation
    // if (!conversation) {
    //   const newConversation = await this.conversationModel.create({});
    //   const participantsPayload: Participant[] = [
    //     {
    //       timeJoined: new Date(),
    //       conversation: newConversation._id,
    //       user: new Types.ObjectId(userId),
    //     },
    //     {
    //       timeJoined: new Date(),
    //       conversation: newConversation._id,
    //       user: new Types.ObjectId(conversationDTO.receiverId),
    //     },
    //   ];
    //   await this.participantModel.insertMany(participantsPayload);
    //
    //   return { messages: [], receiverParticipant };
    // }
  }

  async saveMessage(userId: string, sendMessageDTO: SendMessageDTO) {
    const receiverParticipantPromise = this.participantModel.findById(
      sendMessageDTO.receiverParticipantId,
    );
    const messagePromise = this.messageModel.create({
      participant: sendMessageDTO.senderParticipantId,
      content: sendMessageDTO.content,
    });

    const [receiverParticipant, message] = await Promise.all([
      receiverParticipantPromise,
      messagePromise,
    ]);

    const newMessage = await this.messageModel
      .findById(message._id)
      .populate({ path: 'participant', populate: 'user' });
    await this.conversationModel.updateOne({
      lastMessage: newMessage,
    });
    return { message: newMessage, receiverParticipant };
  }
}
