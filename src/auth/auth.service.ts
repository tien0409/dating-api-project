import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersRepository } from 'src/users/users.repository';
import { AuthCredentialsDTO } from './dtos/auth-credetials.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredetialsDto: AuthCredentialsDTO) {
    const { username, password } = authCredetialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return this.usersRepository.create({ username, password: hashedPassword });
  }

  async signIn(authCredetialsDto: AuthCredentialsDTO) {
    const { username, password } = authCredetialsDto;
    const userExists = await this.usersRepository.findOne({ username });
    if (!userExists) {
      throw new UnauthorizedException('Please check your login credetials');
    }
    const isMatchPassword = await bcrypt.compare(password, userExists.password);
    if (!isMatchPassword) {
      throw new UnauthorizedException('Please check your login credetials');
    }

    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
