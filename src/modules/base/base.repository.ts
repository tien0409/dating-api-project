import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async find(filterQuery: FilterQuery<T>): Promise<T[] | null> {
    return this.model.find(filterQuery);
  }

  async findOne(
    filterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.model.findOne(filterQuery, projection);
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filterQuery, updateEntityData, {
      new: true,
    });
  }

  async updateOne(
    filterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
  ): Promise<boolean> {
    const updated = await this.model.updateOne(filterQuery, updateEntityData);
    return updated.modifiedCount === 1;
  }

  async updateMany(
    filterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
  ): Promise<boolean> {
    const updated = await this.model.updateMany(filterQuery, updateEntityData);
    return updated.modifiedCount >= 1;
  }

  async create(modelData: unknown): Promise<T> {
    const entity = new this.model(modelData);
    return await entity.save();
  }

  async deleteOne(id: string): Promise<boolean> {
    const deleteResult = await this.model.deleteOne({ _id: id });
    return deleteResult.deletedCount >= 1;
  }

  async deleteMany(filterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.model.deleteMany(filterQuery);
    return deleteResult.deletedCount >= 1;
  }
}
