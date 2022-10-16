import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BaseModule } from './base/base.module';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://stone0409:leanhtien@cluster0.ae0l5o3.mongodb.net/?retryWrites=true&w=majority',
      {
        dbName: 'Dating',
      },
    ),
    UsersModule,
    BaseModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
