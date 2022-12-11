import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Gender, GenderDocument } from './gender.schema';

@Injectable()
export class GenderService {
  constructor(
    @InjectModel(Gender.name)
    private readonly genderModel: Model<GenderDocument>,
  ) {}

  getGenders() {
    return this.genderModel.find({});
  }
}
