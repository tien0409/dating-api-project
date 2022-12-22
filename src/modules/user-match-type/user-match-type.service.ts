import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UserMatchType, UserMatchTypeDocument } from './user-match-type.schema';
import { CreateUserMatchTypeDTO } from './dtos/create-user-match-type.dto';

@Injectable()
export class UserMatchTypeService {
  constructor(
    @InjectModel(UserMatchType.name)
    private readonly userMatchTypeModel: Model<UserMatchTypeDocument>,
  ) {}

  getAll() {
    return this.userMatchTypeModel.find({});
  }

  create(createUserMatchTypeDTO: CreateUserMatchTypeDTO) {
    return this.userMatchTypeModel.create(createUserMatchTypeDTO);
  }
}
