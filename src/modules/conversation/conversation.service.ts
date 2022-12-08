import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Conversation, ConversationDocument } from './conversation.schema';
import { UpdateLastMessageDTO } from './dtos/update-last-message.dto';
import { CreateConversationDTO } from './dtos/create-conversation.dto';
import { ParticipantService } from '../participant/participant.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
    private readonly participantService: ParticipantService,
    private readonly userService: UsersService,
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

  async createConversation(
    userAuthId: string,
    createConversationDTO: CreateConversationDTO,
  ) {
    const { receiverId, conversationType = 'private' } = createConversationDTO;

    const conversation = await this.conversationModel.create({
      type: conversationType,
      timeStarted: new Date(),
    });
    const senderParticipantPromise = this.participantService.createParticipant({
      conversationId: conversation._id,
      userId: userAuthId,
    });
    const receiverParticipantPromise =
      this.participantService.createParticipant({
        conversationId: conversation._id,
        userId: receiverId,
      });
    await Promise.all([senderParticipantPromise, receiverParticipantPromise]);
    return conversation;
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
