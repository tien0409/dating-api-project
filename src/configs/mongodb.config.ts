import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongoConfig implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createMongooseOptions():
    | MongooseModuleOptions
    | Promise<MongooseModuleOptions> {
    return {
      connectionFactory: (connection) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      },
      uri: this.configService.get('database.uri'),
      dbName: this.configService.get('database.name'),
    } as MongooseModuleOptions;
  }
}
