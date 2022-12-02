import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateProfileDTO } from './dtos/create-profile.dto';
import { UsersRepository } from './users.repository';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserLoginsRepository } from '../user-logins/user-logins.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userLoginsRepository: UserLoginsRepository,
  ) {}

  async updateRefreshToken(refreshToken: string, userId: string) {
    const salt = await bcrypt.genSalt();
    const refreshTokenHashed = await bcrypt.hash(refreshToken, salt);
    await this.usersRepository.findOneAndUpdate(
      { _id: userId },
      { $set: { 'userLogin.refreshToken': refreshTokenHashed } },
    );
  }

  getByUserLogin(userLoginId: string) {
    return this.usersRepository.findOne({ 'userLogin._id': userLoginId });
  }

  getById(userId: string) {
    return this.usersRepository.findOne({ _id: userId });
  }

  async createUser(createUserDto: CreateUserDTO) {
    return this.usersRepository.create(createUserDto);
  }

  async createProfile(userLoginId: string, createProfileDto: CreateProfileDTO) {
    const newUser = await this.usersRepository.create(createProfileDto);
    return await this.userLoginsRepository.updateOne(
      { _id: userLoginId },
      { $set: { user: newUser } },
    );
  }
}
