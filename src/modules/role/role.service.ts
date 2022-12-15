import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Role, RoleDocument } from './role.schema';
import { CreateRoleDTO } from './dtos/create-role.dto';
import { GetRoleByNameDTO } from './dtos/get-role-by-name.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {}

  getByName(getRoleByNameDTO: GetRoleByNameDTO) {
    const { name } = getRoleByNameDTO;

    return this.roleModel.findOne({ name });
  }

  create(createRoleDTO: CreateRoleDTO) {
    return this.roleModel.create(createRoleDTO);
  }
}
