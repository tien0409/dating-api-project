import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { BaseModule } from './modules/base/base.module';
import { UsersModule } from './modules/users/users.module';
import envConfigs from './configs/env.config';
import { MongoConfig } from './configs/mongodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      load: [envConfigs],
    }),
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongoConfig,
    }),
    UsersModule,
    BaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
