import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { AuthCredentialsDTO } from './dtos/auth-credetials.dto';
import { MailService } from '../mail/mail.service';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDTO } from '../users/dtos/create-user.dto';
import { UpdatePasswordDTO } from './dtos/update-password.dto';
import { UserPreferenceService } from '../user-preference/user-preference.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly userPreferenceService: UserPreferenceService,
  ) {}

  getCookieWithJwtAccessToken(jwtPayload: IJwtPayload) {
    const token = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('jwt.accessSecret'),
      expiresIn: this.configService.get('jwt.accessExpiresIn'),
    });
    return `Authentication=${token}`;
  }

  async getCookieWithJwtRefreshToken(jwtPayload: IJwtPayload) {
    const token = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn') + 's',
    });
    const cookie = `Refresh=${token}`;

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
    await this.userPreferenceService.create(newUser._id.toString());

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
      .populate(
        'photos userLikes userDiscards userMatches userGender relationshipType',
      );
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

  async updatePassword(userId: string, updatePasswordDTO: UpdatePasswordDTO) {
    const { password, confirmPassword, newPassword } = updatePasswordDTO;

    const userExist = await this.usersService.getById(userId);
    if (!userExist) {
      throw new UnauthorizedException(
        'Email or password is incorrect. Please try again.',
      );
    }
    const isMatchPassword = await bcrypt.compare(password, userExist.password);
    if (!isMatchPassword) {
      throw new UnauthorizedException(
        'Password is incorrect. Please try again.',
      );
    } else if (newPassword !== confirmPassword) {
      throw new UnauthorizedException(
        'Confirm password is incorrect. Please try again.',
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return this.usersService.updatePassword(userId, hashedPassword);
  }
}
