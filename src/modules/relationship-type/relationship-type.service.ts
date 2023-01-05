import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
  RelationshipType,
  RelationshipTypeDocument,
} from './relationship-type.schema';
import { LIMIT } from '../../configs/constants.config';
import { GetRelationshipTypesDTO } from './dtos/get-relationship-types.dto';
import { CreateRelationshipTypeDTO } from './dtos/create-relationship-type.dto';
import { UpdateRelationshipTypeDTO } from './dtos/update-relationship-type.dto';

@Injectable()
export class RelationshipTypeService {
  constructor(
    @InjectModel(RelationshipType.name)
    private readonly relationshipTypeModel: Model<RelationshipTypeDocument>,
  ) {}

  getDefault() {
    return this.relationshipTypeModel.findOne({ isDefault: true });
  }

  getAll() {
    return this.relationshipTypeModel.find({});
  }

  async getAdminAll(getRelationshipTypesDTO: GetRelationshipTypesDTO) {
    const { page = 1, search = '' } = getRelationshipTypesDTO;

    const relationshipTypes = await this.relationshipTypeModel
      .find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      })
      .populate('userRelationshipTypes')
      .sort({ _id: -1 })
      .skip((page - 1) * LIMIT)
      .limit(LIMIT);
    const total = await this.relationshipTypeModel.countDocuments();

    return {
      relationshipTypes,
      pagination: {
        perPage: LIMIT,
        currentPage: page,
        totalPage: Math.ceil(total / LIMIT),
      },
    };
  }

  async checkNameExist(name: string, ignoreId?: string) {
    const existName = await this.relationshipTypeModel.findOne({
      $and: [{ name }, { _id: { $ne: ignoreId } }],
    });
    if (existName) throw new BadRequestException('Gender name already exist');
  }

  async checkDefaultExist(ignoreId?: string) {
    const existDefault = await this.relationshipTypeModel.findOne({
      $and: [{ isDefault: true }, { _id: { $ne: ignoreId } }],
    });
    if (existDefault) throw new BadRequestException('Only one default exist');
  }

  async create(createRelationshipTypeDTO: CreateRelationshipTypeDTO) {
    const { name, isDefault } = createRelationshipTypeDTO;

    await this.checkNameExist(name);
    if (isDefault) await this.checkDefaultExist();

    const lastGender = await this.relationshipTypeModel
      .findOne()
      .sort({ _id: -1 });
    const lastNumber = parseInt(lastGender?.code?.split('T')[1]) || 0;
    const code = 'RT' + (lastNumber + 1).toString().padStart(3, '0');

    return this.relationshipTypeModel.create({
      code,
      ...createRelationshipTypeDTO,
    });
  }

  async update(
    id: string,
    updateRelationshipTypeDTO: UpdateRelationshipTypeDTO,
  ) {
    const { name, isDefault } = updateRelationshipTypeDTO;

    await this.checkNameExist(name, id);
    if (isDefault) await this.checkDefaultExist(id);

    return this.relationshipTypeModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ...updateRelationshipTypeDTO,
        },
      },
      { new: true, populate: 'userRelationshipTypes' },
    );
  }

  delete(id: string) {
    return this.relationshipTypeModel.findByIdAndDelete(id);
  }
}
