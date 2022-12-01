import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLoginRepository } from './repositories/user-login.repository';
import { UsersRepository } from './repositories/users.repository';
import { UserLogin, UserLoginSchema } from './schemas/user-login.schema';
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
  providers: [UsersService, UsersRepository, UserLoginRepository],
  exports: [UsersService, UsersRepository, UserLoginRepository],
})
export class UsersModule {}
