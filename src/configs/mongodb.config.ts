import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import * as mongooseAutoPopulate from 'mongoose-autopopulate';

@Injectable()
export class MongoConfig implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    return {
      connectionFactory: (connection) => {
      connection.plugin(mongooseAutoPopulate);
        return connection;
      },
      uri: this.configService.get('database.uri'),
      dbName: this.configService.get('database.name'),
    } as MongooseModuleOptions;
  }
}
