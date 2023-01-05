import { Injectable } from '@nestjs/common';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UserMatch, UserMatchDocument } from './user-match.schema';
import { CreateUserMatchDTO } from './dtos/create-user-match.dto';

@Injectable()
export class UserMatchService {
  constructor(
    @InjectModel(UserMatch.name)
    private readonly userMatchModel: Model<UserMatchDocument>,
  ) {}

  getByFilter(filter: FilterQuery<UserMatch>) {
    return this.userMatchModel.find(filter);
  }

  async getByUserId(userId: string) {
    const userMatches = await this.userMatchModel
      .find({
        $or: [
          { user: new Types.ObjectId(userId) },
          { userMatched: new Types.ObjectId(userId) },
        ],
      })
      .populate('user userMatched')
      .sort({ createdAt: -1 });

    return userMatches.map((userMatch) => {
      const { user, userMatched } = userMatch;

      return {
        ...userMatch.toObject(),
        userMatched:
          userMatched._id.toString() === userId.toString() ? user : userMatched,
        user: user._id.toString() === userId.toString() ? userMatched : user,
      };
    });
  }

  create(userId: string, createUserMatchDTO: CreateUserMatchDTO) {
    const { userMatchedId: userMatched, type } = createUserMatchDTO;

    return this.userMatchModel.create({
      user: new Types.ObjectId(userId),
      userMatched: new Types.ObjectId(userMatched),
      type,
    });
  }
}
