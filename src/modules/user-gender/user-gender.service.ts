import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { UserGender, UserGenderDocument } from './user-gender.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserGenderService {
  constructor(
    @InjectModel(UserGender.name)
    private readonly userGenderModel: Model<UserGenderDocument>,
  ) {}

  create(userGender: UserGender) {
    userGender.gender = new Types.ObjectId(userGender._id);
    delete userGender._id;
    delete userGender.id;
    return this.userGenderModel.create(userGender);
  }

  update(userId: string, userGender: UserGender) {
    userGender.gender = new Types.ObjectId(userGender._id);
    if (userGender.showMeInSearchesAs) {
      userGender.showMeInSearchesAs = userGender.showMeInSearchesAs._id;
    }

    delete userGender._id;
    delete userGender.id;
    return this.userGenderModel.findOneAndUpdate(
      {
        user: new Types.ObjectId(userId),
      },
      {
        $set: {
          ...userGender,
        },
      },
      { new: true },
    );
  }
}
