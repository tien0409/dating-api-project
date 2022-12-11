import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { UserGender, UserGenderDocument } from './user-gender.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserGenderService {
  constructor(
    @InjectModel(UserGender.name)
    private readonly userGenderModel: Model<UserGenderDocument>,
  ) {}

  create(userGender: UserGender) {
    return this.userGenderModel.create(userGender);
  }
}
