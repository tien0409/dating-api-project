import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import {
  UserPreference,
  UserPreferenceDocument,
} from './user-preference.schema';
import { Model, Types } from 'mongoose';
import { UpdateUserPreferenceDTO } from './dtos/update-user-preference.dto';

@Injectable()
export class UserPreferenceService {
  constructor(
    @InjectModel(UserPreference.name)
    private readonly userPreferenceModel: Model<UserPreferenceDocument>,
  ) {}

  update(userId: string, updateUserPreferenceDTO: UpdateUserPreferenceDTO) {
    return this.userPreferenceModel.findOneAndUpdate(
      {
        user: new Types.ObjectId(userId),
      },
      {
        $set: updateUserPreferenceDTO,
      },
      { new: true },
    );
  }

  create(userId: string) {
    return this.userPreferenceModel.create({
      user: new Types.ObjectId(userId),
    });
  }
}
