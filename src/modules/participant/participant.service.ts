import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { Participant, ParticipantDocument } from './participant.schema';
import { CreateParticipantDTO } from './dtos/create-participant.dto';
import { LeftConversationDTO } from './dtos/left-conversation.dto';
import { GetParticipantConversationsDTO } from './dtos/get-participant-conversations.dto';
import { UpdateTimeJoinedDTO } from './dtos/update-time-joined.dto';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participant.name)
    private readonly participantModel: Model<ParticipantDocument>,
  ) {}

  getAll(query: FilterQuery<ParticipantDocument>) {
    return this.participantModel.find(query);
  }

  getByUserId(userId: string) {
    return this.participantModel.findOne({
      user: userId,
    });
  }

  getParticipantConversations(
    getParticipantConversationsDTO: GetParticipantConversationsDTO,
  ) {
    const { userId } = getParticipantConversationsDTO;

    return this.participantModel.find({
      $and: [
        { user: new Types.ObjectId(userId) },
        {
          $or: [
            { $expr: { $gt: ['$timeJoined', '$timeLeft'] } },
            { timeLeft: null },
          ],
        },
      ],
    });
  }

  getByConversationId(conversationId: string) {
    return this.participantModel
      .find({
        conversation: new Types.ObjectId(conversationId),
      })
      .populate('user');
  }

  createParticipant(createParticipantDTO: CreateParticipantDTO) {
    const { conversationId, userId } = createParticipantDTO;

    return this.participantModel.create({
      timeJoined: new Date(),
      user: userId,
      conversation: conversationId,
    });
  }

  // update time joined for users deleted conversation (fire on another user send message)
  updateManyTimeJoined(updateTimeJoinedDTO: UpdateTimeJoinedDTO) {
    const { conversationId } = updateTimeJoinedDTO;

    return this.participantModel.updateMany(
      {
        conversation: conversationId,
        timeLeft: { $ne: null },
      },
      {
        timeJoined: new Date(),
        timeLeft: null,
      },
    );
  }

  leftConversation(leftConversationDTO: LeftConversationDTO) {
    const { conversationId, userId } = leftConversationDTO;

    return this.participantModel.findOneAndUpdate(
      {
        conversation: conversationId,
        user: userId,
      },
      {
        $set: {
          timeLeft: new Date(),
        },
      },
      { new: true },
    );
  }
}
