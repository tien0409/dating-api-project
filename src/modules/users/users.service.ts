import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { UserPhoto, UserPhotoDocument } from './schemas/user-photo.schema';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateProfileDTO } from './dtos/create-profile.dto';
import { Gender, GenderDocument } from './schemas/gender.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(UserPhoto.name)
    private readonly userPhotoModel: Model<UserPhotoDocument>,
    @InjectModel(Gender.name)
    private readonly genderModel: Model<GenderDocument>,
  ) {}

  getByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  getById(userId: string) {
    return this.userModel.findOne({ _id: userId });
  }

  getGenders() {
    return this.genderModel.find();
  }

  createUser(createUserDTO: CreateUserDTO) {
    return this.userModel.create(createUserDTO);
  }

  async updateProfile(userId: string, updateProfileDTO: UpdateProfileDTO) {
    const { userPhotos, ...updateProfileData } = updateProfileDTO;
    const newUser = await this.userModel.findOneAndUpdate(
      { _id: userId },
      updateProfileData,
    );

    const userPhotosPayload = userPhotos.map<UserPhoto>((item) => ({
      link: item,
      user: newUser._id,
    }));
    const photos = await this.userPhotoModel.insertMany(userPhotosPayload);
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { avatar: photos[0]?.link } },
    );
    return {};
  }

  async updateRefreshToken(refreshToken: string, userId: string) {
    const salt = await bcrypt.genSalt();
    const refreshTokenHashed = await bcrypt.hash(refreshToken, salt);
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { refreshToken: refreshTokenHashed } },
    );
  }

  markEmailConfirmed(email: string) {
    return this.userModel.updateOne(
      { email },
      { $set: { confirmationTime: new Date() } },
    );
  }

  async getByRefreshToken(refreshToken: string, userId: string) {
    const user = await this.getById(userId);
    const isMatchRefreshToken = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (isMatchRefreshToken) return user;
  }

  removeRefreshToken(userId: string) {
    return this.userModel.findOneAndUpdate(
      { id: userId },
      { $set: { refreshToken: null } },
    );
  }
}
