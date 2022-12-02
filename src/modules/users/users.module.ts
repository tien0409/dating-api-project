import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLoginsRepository } from '../user-logins/user-logins.repository';
import { UsersRepository } from './users.repository';
import { UserLogin, UserLoginSchema } from '../user-logins/user-login.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserLogin.name, schema: UserLoginSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserLoginsRepository],
  exports: [UsersService, UsersRepository, UserLoginsRepository],
})
export class UsersModule {}
