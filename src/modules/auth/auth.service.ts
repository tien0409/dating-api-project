import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { AuthCredentialsDTO } from './dtos/auth-credetials.dto';
import { MailService } from '../mail/mail.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserLoginsService } from '../user-logins/user-logins.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userLoginsService: UserLoginsService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  getCookieWithJwtAccessToken(jwtPayload: JwtPayload) {
    const token = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('jwt.accessSecret'),
      expiresIn: this.configService.get('jwt.accessExpiresIn'),
    });
    return `Authentication=${token}; Path=/; Max-Age=${this.configService.get(
      'jwt.accessExpiresIn',
    )}`;
  }

  async getCookieWithJwtRefreshToken(jwtPayload: JwtPayload) {
    const token = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn') + 's',
    });
    const cookie = `Refresh=${token}; Path=/; Max-Age=${this.configService.get(
      'jwt.refreshExpiresIn',
    )}`;

    return { cookie, token };
  }

  async signIn(jwtPayload: JwtPayload) {
    const { userLoginId } = jwtPayload;
    const accessTokenCookie = this.getCookieWithJwtAccessToken(jwtPayload);

    const { token, cookie } = await this.getCookieWithJwtRefreshToken(
      jwtPayload,
    );

    await this.userLoginsService.updateRefreshToken(token, userLoginId);

    return { accessTokenCookie, cookie };
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

    const newUserLogin = await this.userLoginsService.createUserLogin({
      email,
      password: hashedPassword,
      confirmationCode,
    });
    await this.mailService.sendVerifyMail({ email, confirmationCode });

    return newUserLogin;
  }

  async logout(userLoginId: string) {
    await this.userLoginsService.removeRefreshToken(userLoginId);
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async getUserAuth(userLoginId: string) {
    const userLogin = await this.userLoginsService.getById(userLoginId);
    return {
      ...userLogin.user,
      email: userLogin.email,
    };
  }

  async getAuthenticatedUser(authCredetialsDto: AuthCredentialsDTO) {
    const { email, password } = authCredetialsDto;
    const userLoginExists = await this.userLoginsService.getByEmail(email);
    if (!userLoginExists) {
      throw new UnauthorizedException(
        'Email or password is incorrect. Please try again.',
      );
    }
    const isMatchPassword = await bcrypt.compare(
      password,
      userLoginExists.password,
    );
    if (!isMatchPassword) {
      throw new UnauthorizedException(
        'Email or password is incorrect. Please try again.',
      );
    }

    return userLoginExists;
  }

  async getUserLoginFromAuthenticationToken(authenticationToken: string) {
    const payload: JwtPayload = this.jwtService.verify(authenticationToken, {
      secret: this.configService.get('jwt.accessSecret'),
    });
    if (payload.userLoginId)
      return this.userLoginsService.getById(payload.userLoginId);
  }
}
