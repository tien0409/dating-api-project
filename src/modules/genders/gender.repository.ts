import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/modules/base/base.repository';
import { Gender, GenderDocument } from './gender.schema';

@Injectable()
export class GendersRepository extends BaseRepository<GenderDocument> {
  constructor(
    @InjectModel(Gender.name) private gendersModel: Model<GenderDocument>,
  ) {
    super(gendersModel);
  }
}
