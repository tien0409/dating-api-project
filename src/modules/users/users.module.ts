import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserLoginsModule } from '../user-logins/user-logins.module';
import { UserPhotosModule } from '../user-photos/user-photos.module';

@Module({
  imports: [
    UserLoginsModule,
    UserPhotosModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
