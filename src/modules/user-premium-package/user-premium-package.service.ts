import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  UserPremiumPackage,
  UserPremiumPackageDocument,
} from './user-premium-package.schema';
import { CreateUserPremiumPackageDTO } from './dtos/create-user-premium-package.dto';

@Injectable()
export class UserPremiumPackageService {
  constructor(
    @InjectModel(UserPremiumPackage.name)
    private readonly userPremiumPackageModel: Model<UserPremiumPackageDocument>,
  ) {}

  getById(id: string) {
    return this.userPremiumPackageModel.findById(id);
  }

  create(
    userId: string,
    createUserPremiumPackageDTO: CreateUserPremiumPackageDTO,
  ) {
    const { premiumPackageId } = createUserPremiumPackageDTO;

    return this.userPremiumPackageModel.create({
      user: new Types.ObjectId(userId),
      premiumPackage: new Types.ObjectId(premiumPackageId),
    });
  }
}
