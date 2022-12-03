import { Injectable } from '@nestjs/common';
import { CreateUserLoginDTO } from './dtos/create-user-login.dto';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UserLogin, UserLoginDocument } from './user-login.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class UserLoginsService {
  constructor(
    @InjectModel(UserLogin.name)
    private readonly userLoginModel: Model<UserLoginDocument>,
  ) {}

  getById(id: string) {
    return this.userLoginModel.findById({ _id: id });
  }

  updateUserField(userLoginId: string, user: User) {
    return this.userLoginModel.updateOne(
      { _id: userLoginId },
      { $set: { user } },
    );
  }

  async getByEmail(email: string) {
    return (await this.userLoginModel.findOne({ email })).populate('user');
  }

  async getByRefreshToken(refreshToken: string, userId: string) {
    const userLogin = await this.getById(userId);
    const isMatchRefreshToken = await bcrypt.compare(
      refreshToken,
      userLogin.refreshToken,
    );

    if (isMatchRefreshToken) return userLogin;
  }

  createUserLogin(createUserLoginDto: CreateUserLoginDTO) {
    return this.userLoginModel.create({... createUserLoginDto });
  }

  markEmailConfirmed(email: string) {
    return this.userLoginModel.updateOne(
      { email },
      { $set: { confirmationTime: new Date() } },
    );
  }

  async updateRefreshToken(refreshToken: string, userLoginId: string) {
    const salt = await bcrypt.genSalt();
    const refreshTokenHashed = await bcrypt.hash(refreshToken, salt);
    await this.userLoginModel.findOneAndUpdate(
      { _id: userLoginId },
      { $set: { refreshToken: refreshTokenHashed } },
    );
  }

  removeRefreshToken(userLoginId: string) {
    return this.userLoginModel.findOneAndUpdate(
      { id: userLoginId },
      { $set: { refreshToken: null } },
    );
  }
}
