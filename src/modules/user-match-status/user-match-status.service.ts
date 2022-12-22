import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  UserMatchStatus,
  UserMatchStatusDocument,
} from './user-match.status.schema';
import { CreateUserMatchStatusDTO } from './dtos/create-user-match-status.dto';

@Injectable()
export class UserMatchStatusService {
  constructor(
    @InjectModel(UserMatchStatus.name)
    private readonly userMatchStatusModel: Model<UserMatchStatusDocument>,
  ) {}

  getAll() {
    return this.userMatchStatusModel.find({});
  }

  create(UserMatchStatusDTO: CreateUserMatchStatusDTO) {
    return this.userMatchStatusModel.create(UserMatchStatusDTO);
  }
}
