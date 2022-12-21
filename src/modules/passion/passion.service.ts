import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Passion, PassionDocument } from './passion.schema';
import { LIMIT } from '../../configs/constants.config';
import { GetPassionsDTO } from './dtos/get-passions.dto';
import { CreatePassionDTO } from './dtos/create-passion.dto';
import { UpdatePassionDTO } from './dtos/update-passion.dto';

@Injectable()
export class PassionService {
  constructor(
    @InjectModel(Passion.name) private passionModel: Model<PassionDocument>,
  ) {}

  async getAll() {
    return this.passionModel.find();
  }

  async getAdminAll(getPassionsDTO: GetPassionsDTO) {
    const { page = 1, search = '' } = getPassionsDTO;

    const passions = await this.passionModel
      .find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      })
      .sort({ _id: -1 })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT);
    const total = await this.passionModel.countDocuments({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    });

    return {
      passions,
      pagination: {
        perPage: LIMIT,
        currentPage: page,
        totalPage: Math.ceil(total / LIMIT) || 1,
      },
    };
  }

  async checkNameExist(name: string, ignoreId?: string) {
    const existName = await this.passionModel.findOne({
      $and: [{ name }, { _id: { $ne: ignoreId } }],
    });
    if (existName) throw new BadRequestException('Passion name already exist');
  }

  async create(createPassionDTO: CreatePassionDTO) {
    console.log('abc');
    const { name } = createPassionDTO;

    await this.checkNameExist(name);

    const lastPassion = await this.passionModel.findOne().sort({ _id: -1 });
    const lastNumber = parseInt(lastPassion?.code?.split('S')[1]) || 0;
    const code = 'PS' + (lastNumber + 1).toString().padStart(3, '0');

    return this.passionModel.create({ code, ...createPassionDTO });
  }

  async update(id: string, updatePassionDTO: UpdatePassionDTO) {
    const { name } = updatePassionDTO;

    await this.checkNameExist(name, id);

    return this.passionModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...updatePassionDTO,
        },
      },
      { new: true },
    );
  }

  delete(id: string) {
    return this.passionModel.findByIdAndDelete(id);
  }
}
