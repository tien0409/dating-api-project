import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Gender, GenderDocument } from './gender.schema';
import { CreateGenderDTO } from './dtos/create-gender.dto';
import { UpdateGenderDTO } from './dtos/update-gender.dto';
import { GetGendersDTO } from './dtos/get-genders.dto';
import { LIMIT } from '../../configs/constants.config';

@Injectable()
export class GenderService {
  constructor(
    @InjectModel(Gender.name)
    private readonly genderModel: Model<GenderDocument>,
  ) {}

  getAll() {
    return this.genderModel.find({});
  }

  async getAdminAll(getGendersDTO: GetGendersDTO) {
    const { page = 1, search = '' } = getGendersDTO;

    const genders = await this.genderModel
      .find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      })
      .populate('userGenders')
      .sort({ _id: -1 })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT);
    const total = await this.genderModel.countDocuments();

    return {
      genders,
      pagination: {
        perPage: LIMIT,
        currentPage: page,
        totalPage: Math.ceil(total / LIMIT),
      },
    };
  }

  async checkNameExist(name: string, ignoreId?: string) {
    const existName = await this.genderModel.findOne({
      $and: [{ name }, { _id: { $ne: ignoreId } }],
    });
    if (existName) throw new BadRequestException('Gender name already exist');
  }

  async create(createGenderDTO: CreateGenderDTO) {
    const { name } = createGenderDTO;

    await this.checkNameExist(name);

    const lastGender = await this.genderModel.findOne().sort({ _id: -1 });
    const lastNumber = parseInt(lastGender?.code?.split('T')[1]) || 0;
    const code = 'GT' + (lastNumber + 1).toString().padStart(3, '0');

    return this.genderModel.create({ code, ...createGenderDTO });
  }

  async update(id: string, updateGenderDTO: UpdateGenderDTO) {
    const { name } = updateGenderDTO;

    await this.checkNameExist(name, id);

    return this.genderModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...updateGenderDTO,
        },
      },
      { new: true, populate: 'userGenders' },
    );
  }

  delete(id: string) {
    return this.genderModel.findByIdAndDelete(id);
  }
}
