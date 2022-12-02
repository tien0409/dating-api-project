import { Injectable } from '@nestjs/common';
import { GendersRepository } from './gender.repository';

@Injectable()
export class GendersService {
  constructor(private readonly gendersRepository: GendersRepository) {}

  getGenders() {
    return this.gendersRepository.find({});
  }
}
