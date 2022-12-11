import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserPhoto, UserPhotoSchema } from './schemas/user-photo.schema';
import { Gender, GenderSchema } from '../gender/gender.schema';
import { InterestedInGenderModule } from '../interested-in-gender/interested-in-gender.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserPhoto.name, schema: UserPhotoSchema },
      { name: Gender.name, schema: GenderSchema },
    ]),
    InterestedInGenderModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
