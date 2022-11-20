import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'jwt.accessExpiresIn',
    )}`;
  }

  getCookieWithJwtRefreshToken(jwtPayload: JwtPayload) {
    const token = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn') + 's',
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
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
  }

  async getAuthenticatedUser(authCredetialsDto: AuthCredentialsDTO) {
    const { email, password } = authCredetialsDto;
    const userExists = await this.usersService.getUserByEmail(email);
    if (!userExists) {
      throw new UnauthorizedException(
        'Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại sau.',
      );
    }
    const isMatchPassword = await bcrypt.compare(password, userExists.password);
    if (!isMatchPassword) {
      throw new UnauthorizedException(
        'Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại sau.',
      );
    }

    return userExists;
  }
}
