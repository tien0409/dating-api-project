import {
  Body,
  Controller,
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

  @Post()
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
}
