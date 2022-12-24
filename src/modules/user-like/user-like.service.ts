import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UserLike, UserLikeDocument } from './user-like.schema';
import { CreateUserLikeDTO } from './dtos/create-user-like.dto';
import { CheckExistingLikeDTO } from './dtos/check-existing-like.dto';

@Injectable()
export class UserLikeService {
  constructor(
    @InjectModel(UserLike.name)
    private readonly userLikeModel: Model<UserLikeDocument>,
  ) {}

  checkExistingLike(
    userId: string,
    checkExistingLikeDTO: CheckExistingLikeDTO,
  ) {
    const { userLikedId } = checkExistingLikeDTO;

    return this.userLikeModel.findOne({
      user: new Types.ObjectId(userId),
      userLiked: new Types.ObjectId(userLikedId),
    });
  }

  create(userId: string, createUserLikeDTO: CreateUserLikeDTO) {
    const { userLikedId } = createUserLikeDTO;

    return this.userLikeModel.create({
      userLiked: new Types.ObjectId(userLikedId),
      user: new Types.ObjectId(userId),
    });
  }
}
