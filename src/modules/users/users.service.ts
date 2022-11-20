import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async updateFrefreshToken(refreshToken: string, userId: string) {
    const salt = await bcrypt.genSalt();
    const refreshTokenHashed = await bcrypt.hash(refreshToken, salt);
    await this.usersRepository.findOneAndUpdate(
      { id: userId },
      { $set: { refreshToken: refreshTokenHashed } },
    );
  }

  getUserById(userId: string) {
    return this.usersRepository.findOne({ id: userId });
  }

  getUserByEmail(email: string) {
    return this.usersRepository.findOne({ email });
  }

  async getUserByRefreshToken(refreshToken: string, userId: string) {
    const user = await this.getUserById(userId);
    const isMatchRefreshToken = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (isMatchRefreshToken) return user;
  }

  async createUser(createUserDto: CreateUserDTO) {
    return await this.usersRepository.create(createUserDto);
  }

  removeRefreshToken(userId: string) {
    return this.usersRepository.findOneAndUpdate(
      { id: userId },
      { $set: { refreshToken: null } },
    );
  }
}
