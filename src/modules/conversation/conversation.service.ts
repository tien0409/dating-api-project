import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Conversation, ConversationDocument } from './conversation.schema';
import { UpdateLastMessageDTO } from './dtos/update-last-message.dto';
import { CreateConversationDTO } from './dtos/create-conversation.dto';
import { ParticipantService } from '../participant/participant.service';
import { GetByUserIdDTO } from './dtos/get-by-user-id.dto';
import { IsCreatedDTO } from './dtos/is-created.dto';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
    private readonly participantService: ParticipantService,
  ) {}

  getById(conversationId: string) {
    return this.conversationModel
      .findById(conversationId)
      .populate({ path: 'participants', populate: { path: 'user' } })
      .populate({
        path: 'lastMessage',
        populate: 'attachments',
      });
  }

  async getByUserIdIncludeConversationDeleted(getByUserIdDTO: GetByUserIdDTO) {
    const { userId } = getByUserIdDTO;
    const myConversations = await this.participantService.getAll({
      user: new Types.ObjectId(userId),
    });

    const myConversationIds = myConversations.map((item) => item.conversation);

    return this.conversationModel
      .find({ _id: { $in: myConversationIds } })
      .populate({
        path: 'participants',
        populate: { path: 'user' },
      })
      .populate({ path: 'lastMessage', populate: 'attachments' });
  }

  // exclude conversation deleted
  async getByUserId(getByUserIdDTO: GetByUserIdDTO) {
    const { userId } = getByUserIdDTO;

    const participantInConversations = await this.participantService.getParticipantConversations(
      { userId },
    );

    const conversationIds = participantInConversations?.map(
      (item) => item.conversation,
    );

    return this.conversationModel
      .find({
        _id: { $in: conversationIds },
      })
      .populate({
        path: 'participants',
        populate: 'user',
        select: '-participants.conversation',
      })
      .populate({
        path: 'lastMessage',
        populate: 'attachments',
      })
      .sort({ _id: -1, lastMessage: -1 });
  }

  isCreated(isCreatedDTO: IsCreatedDTO) {
    const { senderId, receiverId } = isCreatedDTO;

    return this.conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });
  }

  async create(userId: string, createConversationDTO: CreateConversationDTO) {
    const { receiverId, conversationType = 'private' } = createConversationDTO;

    let conversation = await this.conversationModel.create({
      type: conversationType,
      timeStarted: new Date(),
    });
    const senderParticipantPromise = this.participantService.createParticipant({
      conversationId: conversation._id,
      userId,
    });
    const receiverParticipantPromise = this.participantService.createParticipant(
      {
        conversationId: conversation._id,
        userId: receiverId,
      },
    );
    await Promise.all([senderParticipantPromise, receiverParticipantPromise]);

    conversation = await conversation.populate({
      path: 'participants',
      populate: 'user',
      select: '-participants.conversation',
    });
    return conversation;
  }

  updateLastMessage(updateLastMessageDTO: UpdateLastMessageDTO) {
    const { conversationId, lastMessage } = updateLastMessageDTO;

    return this.conversationModel
      .findByIdAndUpdate(
        conversationId,
        {
          lastMessage: lastMessage,
        },
        { new: true },
      )
      .populate({ path: 'participants', populate: { path: 'user' } })
      .populate({
        path: 'lastMessage',
        populate: 'attachments',
      });
  }
}
