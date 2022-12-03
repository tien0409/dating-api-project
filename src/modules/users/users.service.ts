import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateProfileDTO } from './dtos/create-profile.dto';
import { CreateUserDTO } from './dtos/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserLoginsService } from '../user-logins/user-logins.service';
import { UserPhotosService } from '../user-photos/user-photos.service';
import { UserPhoto } from '../user-photos/user-photo.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly userLoginsService: UserLoginsService,
    private readonly userPhotosService: UserPhotosService,
  ) {}

  async updateRefreshToken(refreshToken: string, userId: string) {
    const salt = await bcrypt.genSalt();
    const refreshTokenHashed = await bcrypt.hash(refreshToken, salt);
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { 'userLogin.refreshToken': refreshTokenHashed } },
    );
  }

  getByUserLogin(userLoginId: string) {
    return this.userModel.findOne({ 'userLogin._id': userLoginId });
  }

  getByEmail(email: string) {
    return this.userModel.findOne({ 'userLogin.email': email });
  }

  getById(userId: string) {
    return this.userModel.findOne({ _id: userId });
  }

  createUser(createUserDto: CreateUserDTO) {
    return this.userModel.create(createUserDto);
  }

  async createProfile(userLoginId: string, createProfileDto: CreateProfileDTO) {
    const { userPhotos, ...createProfileData } = createProfileDto;
    const newUser = await this.userModel.findOneAndUpdate(
      { 'userLogin._id': userLoginId },
      createProfileData,
    );

    const userPhotosPayload = userPhotos.map<UserPhoto>((item) => ({
      link: item,
      user: newUser._id,
    }));
    await this.userPhotosService.createUserPhotos({
      userPhotos: userPhotosPayload,
    });
    return this.userLoginsService.updateUserField(userLoginId, newUser);
  }
}
