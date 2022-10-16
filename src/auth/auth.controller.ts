import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dtos/auth-credetials.dto';
import { AUTH_ROUTE } from './utils/routes';

@Controller(AUTH_ROUTE)
export class AuthController {
  constructor(private authService: AuthService) {}

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
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() authCredetialsDto: AuthCredentialsDTO) {
    try {
      return this.authService.signIn(authCredetialsDto);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
