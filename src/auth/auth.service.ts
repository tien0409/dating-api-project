import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersRepository } from 'src/users/users.repository';
import { AuthCredentialsDTO } from './dtos/auth-credetials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(authCredetialsDto: AuthCredentialsDTO) {
    const { username, password } = authCredetialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return this.usersRepository.create({ username, password: hashedPassword });
  }
}
