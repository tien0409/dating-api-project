import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { AuthCredentialsDTO } from './dtos/auth-credetials.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(authCredetialsDto: AuthCredentialsDTO) {
    const { username, password } = authCredetialsDto;

    try {
      const existsUser = await this.usersRepository.findOne({ username });
      if (existsUser) {
        throw new HttpException(
          'Username already exists.',
          HttpStatus.CONFLICT,
        );
      }

      return this.usersRepository.create({ username, password });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
