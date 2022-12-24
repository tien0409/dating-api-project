import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateUserDiscardDTO } from './dtos/create-user-discard.dto';
import { UserDiscard, UserDiscardDocument } from './user-discard.schema';

@Injectable()
export class UserDiscardService {
  constructor(
    @InjectModel(UserDiscard.name)
    private readonly userDiscardModel: Model<UserDiscardDocument>,
  ) {}

  create(userId: string, createUserDiscardDTO: CreateUserDiscardDTO) {
    const { userDiscardId } = createUserDiscardDTO;

    return this.userDiscardModel.create({
      user: new Types.ObjectId(userId),
      userDiscarded: new Types.ObjectId(userDiscardId),
    });
  }
}
