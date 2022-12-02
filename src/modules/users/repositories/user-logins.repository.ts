import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/modules/base/base.repository';
import { UserLogin, UserLoginDocument } from '../schemas/user-login.schema';

@Injectable()
export class UserLoginsRepository extends BaseRepository<UserLoginDocument> {
  constructor(
    @InjectModel(UserLogin.name)
    private userLoginModel: Model<UserLoginDocument>,
  ) {
    super(userLoginModel);
  }
}
