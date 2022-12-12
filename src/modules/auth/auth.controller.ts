import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dtos/auth-credetials.dto';
import { JwtAuthenticationGuard } from './guards/jwt-authentication.guard';
import JwtRefreshTokenGuard from './guards/jwt-refresh-token.guard';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import {
  AUTH_ROUTE,
  LOGOUT_ROUTE,
  REFRESH_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  USER_AUTH,
} from 'src/configs/routes';
import { User } from '../users/schemas/user.schema';

@Controller(AUTH_ROUTE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(SIGN_UP_ROUTE)
  async signUp(@Body() authCredentialsDto: AuthCredentialsDTO, @Res() res) {
    try {
      await this.authService.signUp(authCredentialsDto);

      res.json({
        message:
          'Register successfully! Please check your email to verify account.',
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists.');
      }
      throw new InternalServerErrorException();
    }
  }

  @Post(SIGN_IN_ROUTE)
  @UseGuards(LocalAuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  async signIn(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const jwtPayload: IJwtPayload = {
      userId: user._id,
    };
    const { accessTokenCookie, cookie } = await this.authService.signIn(
      jwtPayload,
    );

    res.setHeader('Set-Cookie', [accessTokenCookie, cookie]);
    res.json({
      data: {
        accountCreated: !!user?.firstName,
      },
      message: 'Login successfully!',
    });
  }

  @Get(USER_AUTH)
  @UseGuards(JwtAuthenticationGuard)
  getUserAuth(@Req() req: Request) {
    const user = req.user as User;

    return this.authService.getUserAuth(user._id);
  }

  @Get(REFRESH_ROUTE)
  @UseGuards(JwtRefreshTokenGuard)
  refresh(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const jwtPayload: IJwtPayload = { userId: user._id };
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      jwtPayload,
    );

    res.setHeader('Set-Cookie', accessTokenCookie);
    return res.json({ data: user });
  }

  @Post(LOGOUT_ROUTE)
  @UseGuards(JwtAuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const cookie = await this.authService.logout(user._id);

    res.setHeader('Set-Cookie', cookie);
    res.json({});
  }
}
