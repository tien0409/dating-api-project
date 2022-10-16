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
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dtos/auth-credetials.dto';
import { AUTH_ROUTE } from './utils/routes';

@Controller(AUTH_ROUTE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDTO) {
    try {
      return this.authService.signUp(authCredentialsDto);
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
  /* @UseGuards(AuthGuard('jwt')) */
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() authCredetialsDto: AuthCredentialsDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { user } = req;
      const cookie = this.authService.getCookieWithJwtToken({
        username: (user as AuthCredentialsDTO).username,
      });
      res.setHeader('Set-Cookie', cookie);
      return this.authService.signIn(authCredetialsDto);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
