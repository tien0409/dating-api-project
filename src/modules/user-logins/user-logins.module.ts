import { Module } from '@nestjs/common';
import { UserLoginsService } from './user-logins.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLogin, UserLoginSchema } from './user-login.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserLogin.name, schema: UserLoginSchema },
    ]),
  ],
  providers: [UserLoginsService],
  exports: [UserLoginsService],
})
export class UserLoginsModule {}
