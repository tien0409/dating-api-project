import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { UserPhoto, UserPhotoDocument } from './schemas/user-photo.schema';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateProfileDTO } from './dtos/create-profile.dto';
import { InterestedInGenderService } from '../interested-in-gender/interested-in-gender.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(UserPhoto.name)
    private readonly userPhotoModel: Model<UserPhotoDocument>,
    private readonly interestedInGenderService: InterestedInGenderService,
  ) {}

  getByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  getById(userId: string) {
    return this.userModel.findOne({ _id: userId });
  }

  createUser(createUserDTO: CreateUserDTO) {
    return this.userModel.create(createUserDTO);
  }

  async updateProfile(userId: string, updateProfileDTO: UpdateProfileDTO) {
    const {
      userPhotos,
      interestedInGenders,
      ...updateProfileData
    } = updateProfileDTO;
    const newUser = await this.userModel.findOneAndUpdate(
      { _id: userId },
      updateProfileData,
    );

    const genderIds = interestedInGenders.map((item) => item.id);
    const userPhotosPayload = userPhotos.map<UserPhoto>((item) => ({
      link: item,
      user: newUser._id,
    }));
    const [photos] = await Promise.all([
      this.userPhotoModel.insertMany(userPhotosPayload),
      this.interestedInGenderService.createMany(userId, { genderIds }),
    ]);

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
