import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

import { UsersService } from '../users/users.service';
import { AuthCredentialsDTO } from './dtos/auth-credetials.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  getCookieWithJwtAccessToken(jwtPayload: JwtPayload) {
    const token = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('jwt.accessSecret'),
      expiresIn: '10s',
    });
    return `Authentication=${token}; Path=/; Max-Age=${this.configService.get(
      'jwt.accessExpiresIn',
    )}`;
  }

  getCookieWithJwtRefreshToken(jwtPayload: JwtPayload) {
    const token = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn') + 's',
    });
    const cookie = `Refresh=${token}; Path=/; Max-Age=${this.configService.get(
      'jwt.refreshExpiresIn',
    )}`;
    return { cookie, token };
  }

  getCookieForLogout() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async signUp(authCredetialsDto: AuthCredentialsDTO) {
    try {
      const { email, password } = authCredetialsDto;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const confirmationCode = this.jwtService.sign(
        { email },
        {
          secret: this.configService.get('jwt.accessSecret'),
          expiresIn: this.configService.get('jwt.mailExpiresIn'),
        },
      );

      const newUser = await this.usersService.createUser({
        email,
        password: hashedPassword,
        confirmationCode,
      });

      await this.mailService.sendVerifyMail({ email, confirmationCode });

      return newUser;
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('Email already exists.');
      }
      throw new InternalServerErrorException();
    }
  }

  async getAuthenticatedUser(authCredetialsDto: AuthCredentialsDTO) {
    const { email, password } = authCredetialsDto;
    const userExists = await this.usersService.getByEmail(email);
    if (!userExists) {
      throw new UnauthorizedException(
        'Email or password is incorrect. Please try again.',
      );
    }
    const isMatchPassword = await bcrypt.compare(password, userExists.password);
    if (!isMatchPassword) {
      throw new UnauthorizedException(
        'Email or password is incorrect. Please try again.',
      );
    }

    return userExists;
  }

  async getUserFromAuthenticationToken(authenticationToken: string) {
    const payload: JwtPayload = this.jwtService.verify(authenticationToken, {
      secret: this.configService.get('jwt.accessSecret'),
    });
    if (payload.userId) return this.usersService.getById(payload.userId);
  }
}
