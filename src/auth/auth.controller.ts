import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dtos/auth-credetials.dto';
import { AUTH_ROUTE } from './utils/routes';

@Controller(AUTH_ROUTE)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  signUp(@Body() authCredentialsDto: AuthCredentialsDTO) {
    return this.authService.signUp(authCredentialsDto);
  }
}
