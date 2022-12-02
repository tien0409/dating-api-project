import { UserLogin } from '../../user-logins/user-login.schema';
import { IsNotEmptyObject } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmptyObject()
  userLogin: UserLogin;
}
