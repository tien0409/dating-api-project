import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { UserPhoto, UserPhotoDocument } from './schemas/user-photo.schema';
import { CreateUserDTO } from './dtos/create-user.dto';
import { CreateProfileDTO } from './dtos/create-profile.dto';
import { InterestedInGenderService } from '../interested-in-gender/interested-in-gender.service';
import { UserGenderService } from '../user-gender/user-gender.service';
import { RoleService } from '../role/role.service';
import { RelationshipTypeService } from '../relationship-type/relationship-type.service';
import { GetUsersExploreDTO } from './dtos/get-users-explore.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(UserPhoto.name)
    private readonly userPhotoModel: Model<UserPhotoDocument>,
    private readonly interestedInGenderService: InterestedInGenderService,
    private readonly userGenderService: UserGenderService,
    private readonly roleService: RoleService,
    private readonly relationshipTypeService: RelationshipTypeService,
  ) {}

  getByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  getById(userId: string) {
    return this.userModel.findOne({ _id: userId });
  }

  async getUsersExplore(getUsersExploreDTO: GetUsersExploreDTO) {
    const { page } = getUsersExploreDTO;

    const filter: FilterQuery<UserDocument> = { fullName: { $ne: null } };
    const userExplores = await this.userModel
      .find(filter)
      .populate('photos passions')
      .skip((page - 1) * 2)
      .limit(2);

    const total = await this.userModel.countDocuments(filter);

    return {
      userExplores,
      pagination: {
        perPage: 2,
        currentPage: page,
        totalPage: Math.ceil(total / 2),
      },
    };
  }

  async createUser(createUserDTO: CreateUserDTO) {
    const { role } = createUserDTO;

    if (!role) {
      createUserDTO.role = await this.roleService.getByName({ name: 'USER' });
    }

    return this.userModel.create(createUserDTO);
  }

  async createProfile(userId: string, updateProfileDTO: CreateProfileDTO) {
    const {
      userPhotos,
      interestedInGender,
      userGender,
      ...updateProfileData
    } = updateProfileDTO;

    const defaultRelationshipType = await this.relationshipTypeService.getDefault();

    const newUser = await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          ...updateProfileData,
          relationshipType: defaultRelationshipType,
        },
      },
    );

    const genderIds = [interestedInGender].map((item) => item.id);
    const userPhotosPayload = userPhotos.map<UserPhoto>((item) => ({
      link: item,
      user: newUser._id,
    }));
    userGender.user = new Types.ObjectId(userId);

    const [photos] = await Promise.all([
      this.userPhotoModel.insertMany(userPhotosPayload),
      this.userGenderService.create(userGender),
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
