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
import { UserMatchService } from '../user-match/user-match.service';
import { UserLikeService } from '../user-like/user-like.service';
import { UserDiscardService } from '../user-discard/user-discard.service';
import { UserDiscardDocument } from '../user-discard/user-discard.schema';
import { UserLikeDocument } from '../user-like/user-like.schema';
import { LIMIT, USER_ROLE } from '../../configs/constants.config';
import { PaymentService } from '../payment/payment.service';
import { UpdateProfileDTO } from './dtos/update-profile.dto';

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
    private readonly userMatchService: UserMatchService,
    private readonly userLikeService: UserLikeService,
    private readonly userDiscardService: UserDiscardService,
    private readonly stripeService: PaymentService,
  ) {}

  getPhotosByUserId(userId: string) {
    return this.userPhotoModel.find({ user: userId });
  }

  getAll(filterQuery: FilterQuery<UserDocument> = {}) {
    return this.userModel.find(filterQuery);
  }

  getByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  getById(userId: string) {
    return this.userModel.findOne({ _id: userId });
  }

  async getUsersExplore(
    userId: string,
    getUsersExploreDTO: GetUsersExploreDTO,
  ) {
    const { page } = getUsersExploreDTO;

    const matchTypeFilter: FilterQuery<
      UserDiscardDocument | UserLikeDocument
    > = {
      user: new Types.ObjectId(userId),
    };
    const [userLikeExclude, userDiscardExclude] = await Promise.all([
      this.userLikeService.getByFilter(matchTypeFilter),
      this.userDiscardService.getByFilter(matchTypeFilter),
    ]);
    const userLikeIdsExcludeArr = userLikeExclude.map((item) => item.userLiked);
    const userDiscardIdsExcludeArr = userDiscardExclude.map(
      (item) => item.userDiscarded,
    );

    const filter: FilterQuery<UserDocument> = {
      role: USER_ROLE,
      fullName: { $ne: null },
      _id: {
        $nin: [
          new Types.ObjectId(userId),
          ...userLikeIdsExcludeArr,
          ...userDiscardIdsExcludeArr,
        ],
      },
    };

    const userExplores = await this.userModel
      .find(filter)
      .populate('photos passions')
      .skip((page - 1) * 2)
      .limit(2);

    const total = await this.userModel.countDocuments(filter);

    return {
      userExplores,
      pagination: {
        perPage: LIMIT,
        currentPage: page,
        totalPage: Math.ceil(total / LIMIT),
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

  async updateProfile(userId: string, updateProfileDTO: UpdateProfileDTO) {
    const { userGender } = updateProfileDTO;
    if (userGender) {
      await this.userGenderService.update(userId, userGender);
      delete updateProfileDTO.userGender;
    }

    return this.userModel.findOneAndUpdate({ _id: userId }, updateProfileDTO, {
      new: true,
    });
  }

  async createProfile(userId: string, updateProfileDTO: CreateProfileDTO) {
    const {
      userPhotos,
      interestedInGender,
      userGender,
      firstName,
      lastName,
      ...updateProfileData
    } = updateProfileDTO;
    const user = await this.getById(userId);
    const stripeCustomer = await this.stripeService.createCustomer(
      firstName + ' ' + lastName,
      user.email,
    );

    const defaultRelationshipType = await this.relationshipTypeService.getDefault();

    const genderIds = [interestedInGender].map((item) => item.id);
    const userPhotosPayload = userPhotos.map<UserPhoto>((item) => ({
      link: item,
      user: new Types.ObjectId(userId),
    }));
    userGender.user = new Types.ObjectId(userId);

    const [photos] = await Promise.all([
      this.userPhotoModel.insertMany(userPhotosPayload),
      this.userGenderService.create(userGender),
      this.interestedInGenderService.createMany(userId, { genderIds }),
    ]);

    await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          ...updateProfileData,
          firstName,
          lastName,
          stripeCustomerId: stripeCustomer.id,
          relationshipType: defaultRelationshipType,
          avatar: photos[0]?.link,
        },
      },
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

  updatePassword(userId: string, newPassword: string) {
    return this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { password: newPassword } },
    );
  }
}
