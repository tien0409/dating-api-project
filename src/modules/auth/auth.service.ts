import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { AuthCredentialsDTO } from './dtos/auth-credetials.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getCookieWithJwtToken(jwtPayload: JwtPayload) {
    const token = this.jwtService.sign(jwtPayload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'jwt.expiresIn',
    )}`;
  }

  async signUp(authCredetialsDto: AuthCredentialsDTO) {
    const { username, password } = authCredetialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return this.usersService.createUser({ username, password: hashedPassword });
  }

  async signIn(authCredetialsDto: AuthCredentialsDTO) {
    const { username, password } = authCredetialsDto;
    const userExists = await this.usersService.getByUsername(username);
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
