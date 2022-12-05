import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Participant, ParticipantDocument } from './participant.schema';

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
}
