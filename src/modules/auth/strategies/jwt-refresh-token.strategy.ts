import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from 'src/modules/users/users.service';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.headers?.refresh as any;
        },
      ]),
      secretOrKey: configService.get('jwt.refreshSecret'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: IJwtPayload) {
    const refreshToken = req.cookies?.Refresh;
    const user = this.usersService.getByRefreshToken(
      refreshToken,
      payload.userId,
    );

    if (!user)
      throw new UnauthorizedException('Please check your login credentials');
    return user;
  }
}
