import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { AuthCredentialsDTO } from './dtos/auth-credetials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(authCredetialsDto: AuthCredentialsDTO) {
    const { username, password } = authCredetialsDto;
    return this.usersRepository.create({ username, password });
  }
}
