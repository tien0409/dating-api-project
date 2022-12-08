import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Participant, ParticipantDocument } from './participant.schema';
import { CreateParticipantDTO } from './dtos/create-participant.dto';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participant.name)
    private readonly participantModel: Model<ParticipantDocument>,
  ) {}

  getById(_id: string) {
    return this.participantModel.findById(_id).populate('user');
  }

  getByConversationId(conversationId: string) {
    return this.participantModel
      .find({
        conversation: conversationId,
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
}
