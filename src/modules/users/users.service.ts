import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateProfileDTO } from './dtos/update-profile.dto';
import { UserLoginRepository } from './repositories/user-login.repository';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userLoginRepository: UserLoginRepository
  ) {}

  async updateRefreshToken(refreshToken: string, userId: string) {
    const salt = await bcrypt.genSalt();
    const refreshTokenHashed = await bcrypt.hash(refreshToken, salt);
    await this.usersRepository.findOneAndUpdate(
      { _id: userId },
      { $set: { "userLogin.refreshToken": refreshTokenHashed } },
    );
  }

  getById(userId: string) {
    return this.usersRepository.findOne({ _id: userId });
  }

  getByEmail(email: string) {
    return this.usersRepository.findOne({ "userLogin.email": email });
  }

  async getByRefreshToken(refreshToken: string, userId: string) {
    const user = await this.getById(userId);
    const isMatchRefreshToken = await bcrypt.compare(
      refreshToken,
      user.userLogin.refreshToken,
    );

    if (isMatchRefreshToken) return user;
  }

  async createUser(createUserDto: CreateUserDTO) {
    const userLogin = await this.userLoginRepository.create(createUserDto);
    return this.usersRepository.create({ userLogin });
  }

  async markEmailConfirmed(email: string) {
    return await this.usersRepository.updateOne(
      { email },
      { $set: { confirmationTime: new Date() } },
    );
  }

  removeRefreshToken(userId: string) {
    return this.usersRepository.findOneAndUpdate(
      { id: userId },
      { $set: { "userLogin.refreshToken": null } },
    );
  }

  async createProfile(userId: string, updateProfileDto: UpdateProfileDTO) {
    return this.usersRepository.updateOne(
      { _id: userId },
      { ...updateProfileDto },
    );
  }
}
