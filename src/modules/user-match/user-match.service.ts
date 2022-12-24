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

  create(userId: string, createUserMatchDTO: CreateUserMatchDTO) {
    const { userMatchedId: userMatched, type } = createUserMatchDTO;

    return this.userMatchModel.create({
      user: new Types.ObjectId(userId),
      userMatched: new Types.ObjectId(userMatched),
      type,
    });
  }
}
