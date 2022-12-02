import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserLoginsService } from '../../user-logins/user-logins.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly usersService: UsersService,
    private readonly userLoginsService: UserLoginsService,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('jwt.accessSecret'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.Authentication;
        },
      ]),
    });
  }

  async validate(jwtPayload: JwtPayload) {
    const { userLoginId } = jwtPayload;
    const userLogin = await this.userLoginsService.getById(userLoginId);
    if (!userLogin) {
      throw new UnauthorizedException('Please check your login credetials');
    }
    return userLogin;
  }
}
