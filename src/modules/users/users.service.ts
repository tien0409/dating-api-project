import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getByUsername(username: string) {
    return this.usersRepository.findOne({ username });
  }

  createUser(createUserDto: CreateUserDTO) {
    return this.usersRepository.create(createUserDto);
  }
}
