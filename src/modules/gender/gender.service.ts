import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Gender, GenderDocument } from './gender.schema';
import { CreateGenderDTO } from './dtos/create-gender.dto';
import { UpdateGenderDTO } from './dtos/update-gender.dto';

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

  async checkNameExist(name: string, ignoreId?: string) {
    const existName = await this.genderModel.findOne({
      $and: [{ name }, { _id: { $ne: ignoreId } }],
    });
    if (existName) throw new BadRequestException('Gender name already exist');
  }

  async create(createGenderDTO: CreateGenderDTO) {
    const { name } = createGenderDTO;

    await this.checkNameExist(name);

    const lastGender = await this.genderModel.findOne().sort({ createdAt: -1 });
    const lastNumber = parseInt(lastGender?.code?.split('T')[1]) || 0;
    const code = 'GT' + (lastNumber + 1).toString().padStart(3, '0');

    return this.genderModel.create({ code, ...createGenderDTO });
  }

  async update(updateGenderDTO: UpdateGenderDTO) {
    const { name, id } = updateGenderDTO;

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
