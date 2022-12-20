import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Gender, GenderDocument } from './gender.schema';
import { CreateGenderDTO } from './dtos/create-gender.dto';

@Injectable()
export class GenderService {
  constructor(
    @InjectModel(Gender.name)
    private readonly genderModel: Model<GenderDocument>,
  ) {}

  getAll() {
    return this.genderModel.find({});
  }

  getAdminAll() {
    return this.genderModel.find({}).populate('userGenders');
  }

  async create(createGenderDTO: CreateGenderDTO) {
    const count = await this.genderModel.countDocuments({});
    const code = 'GT' + (count + 1).toString().padStart(3, '0');

    return this.genderModel.create({ code, ...createGenderDTO });
  }
}
