import { Injectable } from '@nestjs/common';
import { UserLoginsRepository } from './user-logins.repository';
import { CreateUserLoginDTO } from './dtos/create-user-login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserLoginsService {
  constructor(private readonly userLoginsRepository: UserLoginsRepository) {}

  async getById(id: string) {
    return (await this.userLoginsRepository.findOne({ _id: id })).populate(
      'user',
    );
  }

  async getByEmail(email: string) {
    return (await this.userLoginsRepository.findOne({ email })).populate(
      'user',
    );
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
    return this.userLoginsRepository.create(createUserLoginDto);
  }

  async markEmailConfirmed(email: string) {
    return await this.userLoginsRepository.updateOne(
      { email },
      { $set: { confirmationTime: new Date() } },
    );
  }

  async updateRefreshToken(refreshToken: string, userLoginId: string) {
    const salt = await bcrypt.genSalt();
    const refreshTokenHashed = await bcrypt.hash(refreshToken, salt);
    await this.userLoginsRepository.findOneAndUpdate(
      { _id: userLoginId },
      { $set: { refreshToken: refreshTokenHashed } },
    );
  }

  removeRefreshToken(userLoginId: string) {
    return this.userLoginsRepository.findOneAndUpdate(
      { id: userLoginId },
      { $set: { refreshToken: null } },
    );
  }
}
