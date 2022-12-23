import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UserMatch, UserMatchDocument } from './user-match.schema';
import { CreateUserMatchDTO } from './dtos/create-user-match.dto';

@Injectable()
export class UserMatchService {
  constructor(
    @InjectModel(UserMatch.name)
    private readonly userMatchModel: Model<UserMatchDocument>,
  ) {}

  async create(createUserMatchDTO: CreateUserMatchDTO) {
    const { userId: user, userMatchId: userMatch, type } = createUserMatchDTO;

    return this.userMatchModel.create({ user, userMatch, type });
  }
}
