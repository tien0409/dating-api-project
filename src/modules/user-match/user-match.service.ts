import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UserMatch, UserMatchDocument } from './user-match.schema';
import { CreateUserMatchDTO } from './dtos/create-user-match.dto';
import { CheckExistingMatchDTO } from './dtos/check-existing-match.dto';
import { UpdateStatusDTO } from './dtos/update-status.dto';

@Injectable()
export class UserMatchService {
  constructor(
    @InjectModel(UserMatch.name)
    private readonly userMatchModel: Model<UserMatchDocument>,
  ) {}

  async create(createUserMatchDTO: CreateUserMatchDTO) {
    const { userId: user, userMatchId: userMatch, type } = createUserMatchDTO;

    return this.userMatchModel.create({
      user: new Types.ObjectId(user),
      userMatch: new Types.ObjectId(userMatch),
      type,
    });
  }

  async updateStatus(updateStatusDTO: UpdateStatusDTO) {
    const { matchId } = updateStatusDTO;

    return this.userMatchModel.updateOne(
      { _id: matchId },
      { status: 'accepted' },
    );
  }

  checkExistingMatch(checkExistingMatchDTO: CheckExistingMatchDTO) {
    const { userId, userMatchId } = checkExistingMatchDTO;

    return this.userMatchModel
      .findOne({
        user: new Types.ObjectId(userId),
        userMatch: new Types.ObjectId(userMatchId),
      })
      .populate('user userMatch');
  }
}
