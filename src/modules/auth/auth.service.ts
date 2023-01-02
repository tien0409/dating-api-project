import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { AuthCredentialsDTO } from './dtos/auth-credetials.dto';
import { MailService } from '../mail/mail.service';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDTO } from '../users/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  getCookieWithJwtAccessToken(jwtPayload: IJwtPayload) {
    const token = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('jwt.accessSecret'),
      expiresIn: this.configService.get('jwt.accessExpiresIn'),
    });
    return `Authentication=${token}; Path=/; Max-Age=${this.configService.get(
      'jwt.accessExpiresIn',
    )}`;
  }

  async getCookieWithJwtRefreshToken(jwtPayload: IJwtPayload) {
    const token = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn') + 's',
    });
    const cookie = `Refresh=${token}; Path=/; Max-Age=${this.configService.get(
      'jwt.refreshExpiresIn',
    )}`;

    return { cookie, token };
  }

  async signUp(authCredentialsDTO: AuthCredentialsDTO) {
    const { email, password } = authCredentialsDTO;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const confirmationCode = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('jwt.accessSecret'),
        expiresIn: this.configService.get('jwt.mailExpiresIn'),
      },
    );

    const createUserDTO: CreateUserDTO = {
      email,
      password: hashedPassword,
      confirmationCode,
    };
    const newUser = await this.usersService.createUser(createUserDTO);
    await this.mailService.sendVerifyMail({ email, confirmationCode });

    return newUser;
  }

  async signIn(jwtPayload: IJwtPayload) {
    const { userId } = jwtPayload;
    const accessTokenCookie = this.getCookieWithJwtAccessToken(jwtPayload);

    const { token, cookie } = await this.getCookieWithJwtRefreshToken(
      jwtPayload,
    );

    await this.usersService.updateRefreshToken(token, userId);

    return { accessTokenCookie, cookie };
  }

  async logout(userId: string) {
    await this.usersService.removeRefreshToken(userId);
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  getUserAuth(userId: string) {
    return this.usersService
      .getById(userId)
      .populate('photos userLikes userDiscards userMatches userGender');
  }

  async getAuthenticatedUser(authCredentialsDto: AuthCredentialsDTO) {
    const { email, password } = authCredentialsDto;
    const userExist = await this.usersService.getByEmail(email);
    if (!userExist) {
      throw new UnauthorizedException(
        'Email or password is incorrect. Please try again.',
      );
    }
    const isMatchPassword = await bcrypt.compare(password, userExist.password);
    if (!isMatchPassword) {
      throw new UnauthorizedException(
        'Email or password is incorrect. Please try again.',
      );
    }

    return userExist;
  }

  async getUserFromAuthenticationToken(authenticationToken: string) {
    const payload: IJwtPayload = this.jwtService.verify(authenticationToken, {
      secret: this.configService.get('jwt.accessSecret'),
    });
    if (payload.userId) return this.usersService.getById(payload.userId);

    new UnauthorizedException(
      "You don't have permission to access this resource",
    );
  }
}
