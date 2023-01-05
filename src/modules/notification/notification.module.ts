import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationService } from './notification.service';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationController } from './notification.controller';
import { NotificationAdminController } from './notification.admin.controller';
import { UsersModule } from '../users/users.module';
import { NotificationObjectModule } from '../notification-object/notification-object.module';
import { UserPremiumPackageModule } from '../user-premium-package/user-premium-package.module';
import { PremiumPackageModule } from '../premium-package/premium-package.module';

@Module({
  imports: [
    UsersModule,
    NotificationObjectModule,
    ConfigModule,
    UserPremiumPackageModule,
    PremiumPackageModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController, NotificationAdminController],
})
export class NotificationModule {}
