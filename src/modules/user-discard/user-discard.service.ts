import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { CreateUserDiscardDTO } from './dtos/create-user-discard.dto';
import { UserDiscard, UserDiscardDocument } from './user-discard.schema';

@Injectable()
export class UserDiscardService {
  constructor(
    @InjectModel(UserDiscard.name)
    private readonly userDiscardModel: Model<UserDiscardDocument>,
  ) {}

  getByFilter(filter: FilterQuery<UserDiscard>) {
    return this.userDiscardModel.find(filter);
  }

  create(userId: string, createUserDiscardDTO: CreateUserDiscardDTO) {
    const { userDiscardId } = createUserDiscardDTO;

    return this.userDiscardModel.create({
      user: new Types.ObjectId(userId),
      userDiscarded: new Types.ObjectId(userDiscardId),
    });
  }
}
