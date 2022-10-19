import {
  Body,
  Controller,
  HttpCode,
  HttpException,
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
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { AUTH_ROUTE } from './utils/routes';

@Controller(AUTH_ROUTE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDTO) {
    try {
      return await this.authService.signUp(authCredentialsDto);
    } catch (err) {
      if (err.code === 11000) {
        throw new HttpException(
          'Username already exists.',
          HttpStatus.CONFLICT,
        );
      }
      throw new InternalServerErrorException();
    }
  }

  @Post('signin')
  @UseGuards(LocalAuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  async signIn(@Req() req: Request, @Res() res: Response) {
    try {
      const { user } = req;
      const cookie = this.authService.getCookieWithJwtToken({
        username: (user as AuthCredentialsDTO).username,
      });
      res.setHeader('Set-Cookie', cookie);

      res.json({ data: user });
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  logout(@Res() res: Response) {
    res.setHeader('Set-Cookie', this.authService.getCookieForLogout());
    res.json({});
  }
}
