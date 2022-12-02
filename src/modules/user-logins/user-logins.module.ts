import { Module } from '@nestjs/common';
import { UserLoginsService } from './user-logins.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLogin, UserLoginSchema } from './user-login.schema';
import { UserLoginsRepository } from './user-logins.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserLogin.name, schema: UserLoginSchema },
    ]),
  ],
  providers: [UserLoginsService, UserLoginsRepository],
  exports: [UserLoginsService, UserLoginsRepository],
})
export class UserLoginsModule {}
