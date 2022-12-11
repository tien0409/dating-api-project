import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  InterestedInGender,
  InterestedInGenderDocument,
} from './interested-in-gender.schema';
import { CreateManyInterestedInGenderDTO } from './dtos/create-many-interested-in-gender.dto';

@Injectable()
export class InterestedInGenderService {
  constructor(
    @InjectModel(InterestedInGender.name)
    private readonly interestedInGenderModel: Model<InterestedInGenderDocument>,
  ) {}

  createMany(
    userId: string,
    createManyInterestedInGenderDTO: CreateManyInterestedInGenderDTO,
  ) {
    const { genderIds } = createManyInterestedInGenderDTO;

    const interestedInGenders = genderIds.map((item) => ({
      user: userId,
      gender: item,
    }));

    return this.interestedInGenderModel.insertMany(interestedInGenders);
  }
}
