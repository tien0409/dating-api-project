import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Conversation, ConversationDocument } from './conversation.schema';
import { UpdateLastMessageDTO } from './dtos/update-last-message.dto';
import { CreateConversationDTO } from './dtos/create-conversation.dto';
import { ParticipantService } from '../participant/participant.service';
import { UsersService } from '../users/users.service';
import { GetByParticipantIdDTO } from './dtos/get-by-participant-id.dto';
import { GetByUserIdDTO } from './dtos/get-by-user-id.dto';

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

  async getByUserId(getByUserIdDTO: GetByUserIdDTO) {
    const { userId } = getByUserIdDTO;

    const participantInConversations = await this.participantService.getParticipantConversations(
      { userId },
    );

    const conversationIds = participantInConversations?.map(
      (item) => item.conversation?._id,
    );

    return this.conversationModel
      .find({
        _id: { $in: conversationIds },
      })
      .populate({ path: 'participants', populate: { path: 'user' } });
  }

  getByParticipantId(getByParticipantIdDTO: GetByParticipantIdDTO) {
    const { participantId, conversationId } = getByParticipantIdDTO;

    return this.conversationModel.find({
      _id: conversationId,
      participants: { $elemMatch: { user: '23123' } },
    });
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
    const receiverParticipantPromise = this.participantService.createParticipant(
      {
        conversationId: conversation._id,
        userId: receiverId,
      },
    );
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
