import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { LIMIT } from '../../configs/constants.config';
import {
  PremiumPackage,
  PremiumPackageDocument,
} from './premium-package.schema';
import { GetPremiumPackagesDTO } from './dtos/get-premium-packages.dto';
import { CreatePremiumPackageDTO } from './dtos/create-premium-package.dto';
import { UpdatePremiumPackageDTO } from './dtos/update-premium-package.dto';
import { UpdateStatusDTO } from './dtos/update-status.dto';

@Injectable()
export class PremiumPackageService {
  constructor(
    @InjectModel(PremiumPackage.name)
    private readonly premiumPackageModel: Model<PremiumPackage>,
  ) {}

  async getAll() {
    return this.premiumPackageModel.find();
  }

  getActive() {
    return this.premiumPackageModel.find({ active: true });
  }
  async getAdminAll(getPremiumPackagesDTO: GetPremiumPackagesDTO) {
    const { page = 1, search = '' } = getPremiumPackagesDTO;

    const filter: FilterQuery<PremiumPackageDocument> = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    };

    const premiumPackages = await this.premiumPackageModel
      .find(filter)
      .sort({ _id: -1 })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT);
    const total = await this.premiumPackageModel.countDocuments(filter);

    return {
      premiumPackages,
      pagination: {
        perPage: LIMIT,
        currentPage: page,
        totalPage: Math.ceil(total / LIMIT) || 1,
      },
    };
  }

  async checkMonthExist(numberOfMonths: number, ignoreId?: string) {
    const existName = await this.premiumPackageModel.findOne({
      $and: [{ numberOfMonths }, { _id: { $ne: ignoreId } }],
    });
    if (existName)
      throw new BadRequestException('Number of months already exist');
  }

  async checkNumOfStatus(id: string) {
    const counter = await this.premiumPackageModel.count({
      active: true,
    });
    if (counter >= 4)
      throw new BadRequestException('Maximum 4 active packages');
  }

  async create(createPremiumPackageDTO: CreatePremiumPackageDTO) {
    const { numberOfMonths } = createPremiumPackageDTO;

    await this.checkMonthExist(numberOfMonths);

    const lastPremiumPackage = await this.premiumPackageModel
      .findOne()
      .sort({ _id: -1 });
    const lastNumber = parseInt(lastPremiumPackage?.code?.split('PP')[1]) || 0;
    const code = 'PP' + (lastNumber + 1).toString().padStart(3, '0');

    return this.premiumPackageModel.create({
      code,
      ...createPremiumPackageDTO,
    });
  }

  async update(id: string, updatePremiumPackageDTO: UpdatePremiumPackageDTO) {
    const { numberOfMonths } = updatePremiumPackageDTO;

    await this.checkMonthExist(numberOfMonths, id);

    return this.premiumPackageModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...updatePremiumPackageDTO,
        },
      },
      { new: true },
    );
  }

  async updateStatus(id: string, updateStatusDTO: UpdateStatusDTO) {
    const { active } = updateStatusDTO;

    if (active) await this.checkNumOfStatus(id);

    return this.premiumPackageModel.updateOne(
      { _id: id },
      { $set: { active } },
    );
  }

  delete(id: string) {
    return this.premiumPackageModel.findByIdAndDelete(id);
  }
}
